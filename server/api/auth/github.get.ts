/* import type { H3Event, EventHandlerRequest } from "h3";
import { schema } from "hub:db";
import { eq } from "drizzle-orm"; */

export default defineOAuthGitHubEventHandler({
  /*   async onSuccess(
    event: H3Event<EventHandlerRequest>,
    {
      user,
    }: { user: { email: string; name: string; sub: string; githubId: string } },
  ) {
    let existingUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, user.email))
      .get();

    if (existingUser) {
      if (!existingUser.githubId) {
        await db
          .update(schema.users)
          .set({ githubId: user.sub })
          .where(eq(schema.users.id, existingUser.id));
      }
    } else {
      existingUser = await db
        .insert(schema.users)
        .values({
          email: user.email,
          name: user.name,
          githubId: user.sub,
          createdAt: new Date(),
        })
        .returning()
        .get();
    }

    await setUserSession(event, {
      user: {
        email: user.email,
        name: user.name,
      },
    });
    return sendRedirect(event, "/main");
  },
  onError(event: H3Event<EventHandlerRequest>, error: unknown) {
    console.error("Github Login Error:", error);
    return sendRedirect(event, "/login");
  }, */
});
