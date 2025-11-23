"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { SubmitRequestDialog } from "@/components/SubmitRequestDialog";

interface Request {
  id: string;
  title: string;
  description?: string;
  author: string;
  upvotes: number;
  createdAt: number;
  upvotedBy: string[];
  score?: number;
}

export default function Home() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [upvotingIds, setUpvotingIds] = useState<Set<string>>(new Set());

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/requests");
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // Refresh every 10 seconds to update decay scores
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpvote = async (id: string) => {
    if (upvotingIds.has(id)) return;

    setUpvotingIds((prev) => new Set(prev).add(id));

    try {
      const response = await fetch(`/api/requests/${id}/upvote`, {
        method: "POST",
      });

      if (response.ok) {
        await fetchRequests();
      }
    } catch (error) {
      console.error("Failed to upvote:", error);
    } finally {
      setUpvotingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleSubmit = async (
    title: string,
    description: string,
    author: string
  ) => {
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, author }),
      });

      if (response.ok) {
        await fetchRequests();
      }
    } catch (error) {
      console.error("Failed to submit request:", error);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const weeks = Math.floor(diff / 604800000);

    if (weeks > 0) return `${weeks}w ago`;
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Network School
            </h1>
            <p className="mt-2 text-muted-foreground">
              Community feature requests • Forest City, Malaysia
            </p>
          </div>
          <SubmitRequestDialog onSubmit={handleSubmit} />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center text-muted-foreground py-12">
            Loading requests...
          </div>
        )}

        {/* Empty state */}
        {!loading && requests.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground text-lg">
                No requests yet. Be the first to submit one!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Requests list */}
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardAction>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex flex-col items-center gap-1 h-auto py-2 px-4 min-w-[70px]"
                    onClick={() => handleUpvote(request.id)}
                    disabled={upvotingIds.has(request.id)}
                  >
                    <ArrowUp className="h-5 w-5" />
                    <span className="text-lg font-bold">{request.upvotes}</span>
                  </Button>
                </CardAction>
                <CardTitle className="text-xl">{request.title}</CardTitle>
                <CardDescription>
                  {request.description && (
                    <span className="block mb-1">{request.description}</span>
                  )}
                  <span className="text-xs">
                    by {request.author} • {formatTimeAgo(request.createdAt)}
                  </span>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}