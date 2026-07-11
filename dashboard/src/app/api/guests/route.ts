import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthorizedRequest } from "@/lib/auth";
import { attachDrawingUrls } from "@/lib/oss-drawings";
import { computeGuestStats } from "@/lib/guest-stats";
import { fetchAllGuests } from "@/lib/tablestore";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const guests = await fetchAllGuests();
    const guestsWithDrawings = await attachDrawingUrls(guests);

    return NextResponse.json({
      guests: guestsWithDrawings,
      stats: computeGuestStats(guestsWithDrawings),
    });
  } catch (error) {
    console.error("[dashboard] /api/guests failed:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const hint =
      message.includes("credentials") || message.includes("Profile")
        ? "\n\n" +
          "本地请先执行：aliyun configure --mode OAuth --profile wedding"
        : "";
    return NextResponse.json(
      { error: "Failed to load guests", message: message + hint },
      { status: 500 },
    );
  }
}
