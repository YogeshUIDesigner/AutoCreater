import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { platform, accountId, handle, accessToken } = body;

    if (!platform || !accountId || !handle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate platform
    const validPlatforms = ["YOUTUBE", "INSTAGRAM", "TIKTOK", "FACEBOOK"];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    // Upsert the channel (create or update)
    const channel = await prisma.channel.upsert({
      where: {
        userId_platform: {
          userId: session.user.id,
          platform: platform,
        },
      },
      update: {
        accountId,
        handle,
        accessToken: accessToken || "",
        connected: true,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        platform,
        accountId,
        handle,
        accessToken: accessToken || "",
        connected: true,
      },
    });

    return NextResponse.json({ success: true, channel });
  } catch (error) {
    console.error("Error saving channel:", error);
    return NextResponse.json({ error: "Failed to save channel" }, { status: 500 });
  }
}
