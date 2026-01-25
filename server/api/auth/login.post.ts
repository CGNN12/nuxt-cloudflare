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

  if (user && (await verifyPassword(user.password!, password))) {
    // set the user session in the cookie
    // this server util is auto-imported by the auth-utils module
    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
    return {};
  }
  throw createError({
    status: 401,
    message: "Bad credentials",
  });
});
