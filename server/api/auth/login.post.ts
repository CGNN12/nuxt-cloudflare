import { users } from "~~/server/db/schema";
import { eq } from "drizzle-orm";
import { LoginSchema } from "~~/shared/LoginSchema";

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, LoginSchema.parse);

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (!user) {
    throw createError({ status: 401, message: "Böyle bir kullanıcı yok!" });
  }

  // Kullanıcı OAuth ile kayıt olduysa password null olur
  if (!user.password) {
    throw createError({
      status: 401,
      message:
        "Bu hesap sosyal giriş ile oluşturulmuş. Lütfen Google veya GitHub ile giriş yapın.",
    });
  }

  try {
    const isPasswordValid = await verifyPassword(user.password, password);

    if (isPasswordValid) {
      await setUserSession(event, {
        user: { id: user.id, email: user.email, name: user.name },
      });
      return {};
    }
  } catch {
    throw createError({
      status: 500,
      message: "Şifre doğrulama sırasında bir hata oluştu.",
    });
  }

  throw createError({ status: 401, message: "Şifre yanlış usta!" });
});
