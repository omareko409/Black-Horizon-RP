import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: { params: { scope: "identify guilds.members.read" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile.id;
        token.image = profile.image_url || `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
        token.name = profile.username;
      }
      
      // Fetch roles if not present or need update
      if (token.accessToken && token.id) {
        try {
          const res = await fetch(`https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`, {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          });
          if (res.ok) {
            const member = await res.json();
            token.roles = member.roles; // Array of role IDs
          } else {
            token.roles = [];
          }
        } catch (e) {
          console.error("Failed to fetch Discord roles", e);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.roles = token.roles || [];
      session.user.image = token.image;
      session.user.name = token.name;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-key-for-development-only-123",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
