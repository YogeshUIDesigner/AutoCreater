import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const res = await prisma.account.deleteMany({
      where: {
        userId: session.user.id,
        provider: "facebook",
      },
    });

    return NextResponse.json({ success: true, deleted: res.count });
  } catch (error) {
    console.error("Error resetting facebook:", error);
    return NextResponse.json({ error: "Failed to reset" }, { status: 500 });
  }
}
