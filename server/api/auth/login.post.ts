import { users } from "~~/server/db/schema";
import { eq } from "drizzle-orm";
import { verifyPasswordPBKDF2 } from "~~/server/utils/password";

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

  const isPasswordValid = await verifyPasswordPBKDF2(user.password!, password);

  if (isPasswordValid) {
    await setUserSession(event, {
      user: { id: user.id, email: user.email, name: user.name },
    });
    return {};
  }

  throw createError({
    status: 401,
    message: "Geçersiz şifre!",
  });
});
