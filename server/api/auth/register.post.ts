import { RegisterSchema } from "~~/shared/RegisterSchema";
import { users } from "~~/server/db/schema";
import { eq } from "drizzle-orm";
import { hashPasswordPBKDF2 } from "~~/server/utils/password";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, RegisterSchema.parse);

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, body.email))
    .get();

  if (existingUser) {
    throw createError({
      statusCode: 409,
      message: "Bu e-posta adresiyle zaten bir hesap oluşturulmuş usta!",
    });
  }

  const hashedPassword = await hashPasswordPBKDF2(body.password);

  const user = await db
    .insert(users)
    .values({
      email: body.email,
      password: hashedPassword,
      name: body.name,
    })
    .returning()
    .get();

  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });

  return { message: "Kayıt başarılı!" };
});
