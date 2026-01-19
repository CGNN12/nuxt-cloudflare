/* import type { H3Event, EventHandlerRequest } from "h3";
import { eq } from "drizzle-orm";
import { schema } from "hub:db"; */

export default defineOAuthGoogleEventHandler({
  /*   async onSuccess(
    event: H3Event<EventHandlerRequest>,
    {
      user,
    }: {
      user: {
        sub: unknown;
        email: string;
        name: string;
      };
    },
  ) {
    let existingUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, user.email))
      .get();

    if (existingUser) {
      if (!existingUser.googleId) {
        await db
          .update(schema.users)
          .set({ googleId: user.sub })
          .where(eq(schema.users.id, existingUser.id));
      }
    } else {
      existingUser = await db
        .insert(schema.users)
        .values({
          email: user.email,
          name: user.name,
          googleId: user.sub,
          createdAt: new Date(),
        })
        .returning()
        .get();
    }

    await setUserSession(event, {
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      },
    });
    return sendRedirect(event, "/main");
  },
  onError(event: H3Event<EventHandlerRequest>, error: unknown) {
    console.error("Google Login Error:", error);
    return sendRedirect(event, "/login");
  }, */
});
