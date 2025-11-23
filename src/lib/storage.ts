// In-memory storage for feature requests
export interface Request {
  id: string;
  title: string;
  description?: string;
  author: string;
  upvotes: number;
  createdAt: number; // timestamp
  upvotedBy: string[]; // array of user IDs who upvoted
}

// In-memory storage
let requests: Request[] = [];
let idCounter = 1;

// Calculate decay score: upvotes / age_in_weeks
export function calculateDecayScore(request: Request): number {
  const now = Date.now();
  const ageInMs = now - request.createdAt;
  const ageInWeeks = Math.max(ageInMs / (1000 * 60 * 60 * 24 * 7), 0.1); // Min 0.1 to avoid division issues
  return request.upvotes / ageInWeeks;
}

// Get all requests sorted by decay score
export function getAllRequests(): Request[] {
  return requests
    .map((req) => ({
      ...req,
      score: calculateDecayScore(req),
    }))
    .sort((a, b) => b.score - a.score);
}

// Create a new request
export function createRequest(
  title: string,
  description: string | undefined,
  author: string
): Request {
  const newRequest: Request = {
    id: String(idCounter++),
    title,
    description,
    author,
    upvotes: 0,
    createdAt: Date.now(),
    upvotedBy: [],
  };
  requests.push(newRequest);
  return newRequest;
}

// Upvote a request
export function upvoteRequest(id: string, userId: string): Request | null {
  const request = requests.find((r) => r.id === id);
  if (!request) return null;
  
  // Check if user already upvoted
  if (request.upvotedBy.includes(userId)) {
    return request; // Already upvoted, return unchanged
  }
  
  request.upvotes++;
  request.upvotedBy.push(userId);
  return request;
}

// Get a single request
export function getRequest(id: string): Request | null {
  return requests.find((r) => r.id === id) || null;
}

// Check if user has upvoted a request
export function hasUserUpvoted(requestId: string, userId: string): boolean {
  const request = requests.find((r) => r.id === requestId);
  return request ? request.upvotedBy.includes(userId) : false;
}
