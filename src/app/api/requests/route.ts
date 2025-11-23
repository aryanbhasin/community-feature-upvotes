import { NextRequest, NextResponse } from "next/server";
import { getAllRequests, createRequest } from "@/lib/storage";
import { cookies } from "next/headers";

// GET /api/requests - Fetch all requests sorted by decay score
export async function GET() {
  const requests = getAllRequests();
  return NextResponse.json(requests);
}

// POST /api/requests - Create a new request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, author } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const newRequest = createRequest(
      title,
      description || undefined,
      author || "Anonymous"
    );

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
