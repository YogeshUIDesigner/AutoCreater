import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ channels: [] });
  }

  try {
    const channels = await prisma.channel.findMany({
      where: { userId: session.user.id, connected: true },
      select: {
        platform: true,
        handle: true,
        followers: true,
        connected: true,
      },
    });

    return NextResponse.json({ channels });
  } catch (error) {
    console.error("Error fetching channels:", error);
    return NextResponse.json({ channels: [] }, { status: 500 });
  }
}
