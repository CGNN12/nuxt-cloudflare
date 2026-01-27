import { LoginSchema } from "#shared/LoginSchema";
import { users } from "~~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, LoginSchema.parse);

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  console.log("Gelen Email:", email);
  console.log("DB'den Gelen User:", user);

  if (!user) {
    throw createError({ status: 401, message: "Böyle bir kullanıcı yok!" });
  }

  const isPasswordValid = await verifyPassword(user.password!, password);
  console.log("Şifre Doğrulama:", isPasswordValid);

  if (isPasswordValid) {
    await setUserSession(event, {
      user: { id: user.id, email: user.email, name: user.name },
    });
    return {};
  }

  throw createError({ status: 401, message: "Şifre yanlış usta!" });
});
