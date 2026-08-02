import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const MAIN_GUILD_ID = process.env.DISCORD_GUILD_ID || "1531459871902404738";
const DEPT_GUILD_ID = "1526502762878210098";

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
      try {
        if (account && profile) {
          token.accessToken = account.access_token;
          token.id = profile.id;
          token.image = profile.avatar 
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` 
            : `https://cdn.discordapp.com/embed/avatars/0.png`;
          token.name = profile.username || profile.global_name || "User";
        }

        if (token.accessToken && token.id) {
          // 1. Fetch Main City Guild Roles
          try {
            const mainRes = await fetch(`https://discord.com/api/users/@me/guilds/${MAIN_GUILD_ID}/member`, {
              headers: { Authorization: `Bearer ${token.accessToken}` },
            });
            if (mainRes.ok) {
              const member = await mainRes.json();
              token.roles = member.roles || [];
              token.mainRoles = member.roles || [];
              token.isServerMember = true;
            } else {
              token.roles = [];
              token.mainRoles = [];
              token.isServerMember = false;
            }
          } catch (e) {
            console.error("Failed to fetch Main Discord roles", e);
            token.roles = [];
            token.mainRoles = [];
            token.isServerMember = false;
          }

          // 2. Fetch Department Guild Roles (Police & Health Guild)
          try {
            const deptRes = await fetch(`https://discord.com/api/users/@me/guilds/${DEPT_GUILD_ID}/member`, {
              headers: { Authorization: `Bearer ${token.accessToken}` },
            });
            if (deptRes.ok) {
              const deptMember = await deptRes.json();
              token.deptRoles = deptMember.roles || [];
            } else {
              token.deptRoles = [];
            }
          } catch (e) {
            console.error("Failed to fetch Department Discord roles", e);
            token.deptRoles = [];
          }
        }
      } catch (err) {
        console.error("Error in JWT callback", err);
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.roles = token.roles || [];
      session.user.mainRoles = token.mainRoles || [];
      session.user.deptRoles = token.deptRoles || [];
      session.user.isServerMember = token.isServerMember || false;
      session.user.image = token.image;
      session.user.name = token.name;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-key-for-development-only-123",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
