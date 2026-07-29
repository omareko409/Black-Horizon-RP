import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route"; // Assuming authOptions is exported

const ADMIN_ROLES = [
  "1532005442602008677",
  "1532006548430393486",
  "1531460117956923462",
  "1532009816623415368"
];

const ACCEPT_ROLE_ID = "1531941362340069496";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.roles.some(role => ADMIN_ROLES.includes(role))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetUserId } = await req.json();

    if (!targetUserId) {
      return NextResponse.json({ error: "Missing targetUserId" }, { status: 400 });
    }

    const botToken = process.env.DISCORD_BOT_TOKEN;
    const guildId = process.env.DISCORD_GUILD_ID;

    // 1. Assign Role
    const roleRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${targetUserId}/roles/${ACCEPT_ROLE_ID}`, {
      method: "PUT",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json"
      }
    });

    if (!roleRes.ok && roleRes.status !== 204) {
      console.error("Failed to assign role:", await roleRes.text());
      return NextResponse.json({ error: "Failed to assign role" }, { status: 500 });
    }

    // 2. Open DM Channel
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
      // 3. Send Message
      await fetch(`https://discord.com/api/v10/channels/${dmChannel.id}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bot ${botToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: `🎉 مبروك! لقد تم **قبولك مبدئياً** في المدينة. يرجى التوجه للديسكورد لإكمال باقي الإجراءات.`
        })
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
