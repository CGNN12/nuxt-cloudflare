import { users } from "~~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

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

  // Kullanıcı OAuth ile kayıt olduysa password null olur
  if (!user.password) {
    console.log("Kullanıcının şifresi yok - OAuth ile kayıt olmuş olabilir");
    throw createError({
      status: 401,
      message:
        "Bu hesap sosyal giriş ile oluşturulmuş. Lütfen Google veya GitHub ile giriş yapın.",
    });
  }

  console.log("Giriş Şifresi (Ham):", password);
  console.log("DB'deki Hash Uzunluğu:", user.password.length);
  console.log("DB'den gelen hash:", user.password);
  console.log("Inputtan gelen ham şifre:", password);

  try {
    const isPasswordValid = await verifyPassword(user.password!, password);
    console.log("Şifre Doğrulama Sonucu:", isPasswordValid);

    if (isPasswordValid) {
      await setUserSession(event, {
        user: { id: user.id, email: user.email, name: user.name },
      });
      return {};
    }
  } catch (err) {
    console.error("verifyPassword hatası:", err);
    throw createError({
      status: 500,
      message: "Şifre doğrulama sırasında bir hata oluştu.",
    });
  }

  throw createError({ status: 401, message: "Şifre yanlış usta!" });
});
