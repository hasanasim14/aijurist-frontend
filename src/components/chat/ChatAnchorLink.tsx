"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ChatAnchorLinksProps {
  messages: Array<{
    role?: string;
    content?: string | object;
    user_query?: string | object;
    llm_response?: string | object;
  }>;
  onLinkClick: (index: number) => void;
  maxLinks?: number;
}

const ChatAnchorLinks = ({
  messages,
  onLinkClick,
  maxLinks = 10,
}: ChatAnchorLinksProps) => {
  const [visibleLinks, setVisibleLinks] = useState<number[]>([]);
  const [showMore, setShowMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract user queries from messages
  const userQueries = messages
    .filter(
      (msg) => msg && (msg.role === "user" || msg.user_query !== undefined)
    )
    .map((msg) => ({
      content:
        typeof msg.content === "string"
          ? msg.content
          : typeof msg.user_query === "string"
          ? msg.user_query
          : JSON.stringify(msg.content || msg.user_query || ""),
    }));

  useEffect(() => {
    // Initialize with all queries
    if (userQueries.length > 0) {
      if (userQueries.length <= maxLinks) {
        setVisibleLinks(
          Array.from({ length: userQueries.length }, (_, i) => i)
        );
        setShowMore(false);
      } else {
        setVisibleLinks(Array.from({ length: maxLinks }, (_, i) => i));
        setShowMore(true);
      }
    }
  }, [userQueries.length, maxLinks]);

  const showAllLinks = () => {
    setVisibleLinks(Array.from({ length: userQueries.length }, (_, i) => i));
    setShowMore(false);
  };

  // Generate a truncated title for the query
  const getTruncatedTitle = (content: string, maxLength = 26) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "..";
  };

  // Generate an ID for the anchor
  const getAnchorId = (index: number) => `query-${index}`;

  if (userQueries.length === 0) {
    return null;
  }

  return (
    <div className="w-full md:w-56 bg-gray-50 p-2 mb-4 md:mb-0 md:ml-4 flex-shrink-0 border-gray-200">
      <div
        ref={containerRef}
        className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto"
      >
        {visibleLinks.map((index) => (
          <div key={index} className="w-full">
            <Link
              href={`#${getAnchorId(index)}`}
              onClick={(e) => {
                e.preventDefault();
                onLinkClick(index);
                const targetElement = document.getElementById(
                  getAnchorId(index)
                );
                if (targetElement) {
                  targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                  history.pushState(null, "", `#${getAnchorId(index)}`);
                }
              }}
              className={cn(
                "text-[0.875rem] py-0 1/2 pl-3 border-l-2 border-gray-300 block hover:border-gray-500 hover:text-gray-900 transition-colors w-full",
                "text-gray-500"
              )}
            >
              <span className="line-clamp-2">
                {getTruncatedTitle(userQueries[index]?.content || "")}
              </span>
            </Link>
          </div>
        ))}

        {showMore && (
          <button
            onClick={showAllLinks}
            className="text-[0.875rem] text-gray-500 hover:text-gray-700 pl-3 mt-2"
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatAnchorLinks;
