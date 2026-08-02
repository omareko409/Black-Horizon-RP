import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const SUPER_ADMINS = ["1531460117956923462", "1532009816623415368"];
const POLICE_ADMINS = ["1526502942494949376", "1526503214881443861"];
const HEALTH_ADMINS = ["1532420174404255936", "1532370272387334246"];

const ALL_ALLOWED_ADMIN_ROLES = [...SUPER_ADMINS, ...POLICE_ADMINS, ...HEALTH_ADMINS];

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const mainRoles = session?.user?.mainRoles || [];
    const deptRoles = session?.user?.deptRoles || [];
    const userRoles = [...mainRoles, ...deptRoles];

    const isAuthorized = ALL_ALLOWED_ADMIN_ROLES.some(r => userRoles.includes(r));

    if (!session || !isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetUserId, roleId, guildId, message, isReject } = await req.json();

    if (!targetUserId) {
      return NextResponse.json({ error: "Missing targetUserId" }, { status: 400 });
    }

    const botToken = process.env.DISCORD_BOT_TOKEN;
    const targetGuildId = guildId || process.env.DISCORD_GUILD_ID || "1531459871902404738";

    // 1. Assign Role if not rejection
    if (roleId && !isReject) {
      const roleRes = await fetch(`https://discord.com/api/v10/guilds/${targetGuildId}/members/${targetUserId}/roles/${roleId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bot ${botToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!roleRes.ok && roleRes.status !== 204) {
        console.error("Failed to assign role:", await roleRes.text());
      }
    }

    // 2. Open DM Channel & Send Message
    const dmRes = await fetch(`https://discord.com/api/v10/users/@me/channels`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ recipient_id: targetUserId })
    });

    if (dmRes.ok) {
      const dmChannel = await dmRes.json();
      await fetch(`https://discord.com/api/v10/channels/${dmChannel.id}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bot ${botToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: message || "🎉 تم تحديث حالة طلب التقديم الخاص بك في Black Horizon RP!"
        })
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
