import type { H3Event, EventHandlerRequest } from "h3";
import { eq } from "drizzle-orm";
import { users } from "~~/server/db/schema";

export default defineOAuthGoogleEventHandler({
  async onSuccess(
    event: H3Event<EventHandlerRequest>,
    {
      user,
    }: {
      user: {
        sub: string;
        email: string;
        name: string;
        googleId: string;
      };
    },
  ) {
    let existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email))
      .get();

    if (existingUser) {
      if (!existingUser.googleId) {
        await db
          .update(users)
          .set({ googleId: user.sub })
          .where(eq(users.id, existingUser.id));
      }
    } else {
      existingUser = await db
        .insert(users)
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
  },
});
