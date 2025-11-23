import { NextRequest, NextResponse } from "next/server";
import { upvoteRequest, getRequest } from "@/lib/storage";
import { cookies } from "next/headers";

// POST /api/requests/[id]/upvote - Upvote a request
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Get or create user ID from cookie
  const cookieStore = await cookies();
  let userId = cookieStore.get("user_id")?.value;
  
  if (!userId) {
    // Generate a simple user ID
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  const updatedRequest = upvoteRequest(id, userId);

  if (!updatedRequest) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  // Set the user ID cookie (expires in 1 year)
  const response = NextResponse.json(updatedRequest);
  response.cookies.set("user_id", userId, {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: "lax",
  });

  return response;
}
