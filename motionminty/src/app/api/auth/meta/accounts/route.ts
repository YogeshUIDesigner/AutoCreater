import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Get the Facebook account with access_token from database
    const fbAccount = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: "facebook",
      },
      select: {
        access_token: true,
      },
    });

    if (!fbAccount?.access_token) {
      return NextResponse.json({
        error: "Facebook not connected. Please connect Facebook first.",
        facebookPages: [],
        instagramAccounts: [],
      });
    }

    const accessToken = fbAccount.access_token;

    // Step 1: Fetch all Facebook Pages the user manages
    const pagesRes = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,picture{url},fan_count,category&access_token=${accessToken}`
    );
    const pagesData = await pagesRes.json();
    console.log("=== FACEBOOK PAGES API RESPONSE ===", JSON.stringify(pagesData, null, 2));

    if (pagesData.error) {
      console.error("Meta API error (pages):", pagesData.error);
      return NextResponse.json({
        error: pagesData.error.message || "Failed to fetch Facebook pages",
        facebookPages: [],
        instagramAccounts: [],
      });
    }

    const facebookPages: Array<{
      id: string;
      name: string;
      picture: string;
      fanCount: number;
      category: string;
      accessToken: string;
    }> = [];

    const instagramAccounts: Array<{
      id: string;
      username: string;
      profilePicture: string;
      followersCount: number;
      linkedPageId: string;
      linkedPageName: string;
      pageAccessToken: string;
    }> = [];

    const pages = pagesData.data || [];

    for (const page of pages) {
      // Add Facebook Page to list
      facebookPages.push({
        id: page.id,
        name: page.name,
        picture: page.picture?.data?.url || "",
        fanCount: page.fan_count || 0,
        category: page.category || "",
        accessToken: page.access_token,
      });

      // Step 2: Check if this page has a linked Instagram Business Account
      try {
        const igRes = await fetch(
          `https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
        );
        const igData = await igRes.json();

        if (igData.instagram_business_account?.id) {
          const igId = igData.instagram_business_account.id;

          // Step 3: Fetch Instagram account details
          const igDetailsRes = await fetch(
            `https://graph.facebook.com/v19.0/${igId}?fields=id,username,profile_picture_url,followers_count,media_count&access_token=${page.access_token}`
          );
          const igDetails = await igDetailsRes.json();

          if (!igDetails.error) {
            instagramAccounts.push({
              id: igId,
              username: igDetails.username || "Unknown",
              profilePicture: igDetails.profile_picture_url || "",
              followersCount: igDetails.followers_count || 0,
              linkedPageId: page.id,
              linkedPageName: page.name,
              pageAccessToken: page.access_token,
            });
          }
        }
      } catch (igErr) {
        console.error(`Error fetching IG for page ${page.id}:`, igErr);
      }
    }

    return NextResponse.json({
      facebookPages,
      instagramAccounts,
    });
  } catch (error) {
    console.error("Error fetching Meta accounts:", error);
    return NextResponse.json(
      { error: "Internal server error", facebookPages: [], instagramAccounts: [] },
      { status: 500 }
    );
  }
}
