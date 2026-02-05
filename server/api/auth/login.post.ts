import { users } from "~~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (!user) {
    throw createError({ status: 401, message: "Böyle bir kullanıcı yok!" });
  }

  const isPasswordValid = await verifyPassword(user.password!, password);

  if (isPasswordValid) {
    await setUserSession(event, {
      user: { id: user.id, email: user.email, name: user.name },
    });
    return {};
  }

  throw createError({ status: 401, message: "Şifre yanlış usta!" });
});
