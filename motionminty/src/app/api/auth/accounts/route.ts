import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ accounts: [] });
  }

  try {
    const accounts = await prisma.account.findMany({
      where: { userId: session.user.id },
      select: { provider: true }
    });

    const providers = accounts.map(acc => acc.provider);
    return NextResponse.json({
      accounts: providers,
      userName: session.user.name || 'User'
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json({ accounts: [] }, { status: 500 });
  }
}
