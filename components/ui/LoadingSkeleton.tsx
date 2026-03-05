"use client";

/**
 * RIVUS OS — Loading Skeleton
 * V2.5-6: Replaces Loader2 spinner with content-aware skeleton.
 * Usage: <LoadingSkeleton lines={4} /> or <LoadingSkeleton type="table" rows={5} />
 */

interface LoadingSkeletonProps {
  /** Number of text lines to show */
  lines?: number;
  /** Skeleton type */
  type?: "text" | "table" | "cards" | "page";
  /** Number of table rows or cards */
  rows?: number;
  /** Number of card columns */
  cols?: number;
}

function SkeletonPulse({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className || ""}`} />;
}

function TextSkeleton({ lines = 3 }: { lines: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonPulse key={i} className={`h-4 ${i === 0 ? "w-3/4" : i === lines - 1 ? "w-1/2" : "w-full"}`} />
      ))}
    </div>
  );
}

function TableSkeleton({ rows = 5 }: { rows: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50/50 border-b border-gray-100 px-3 py-3 flex gap-4">
        {[1, 2, 3, 4].map(i => <SkeletonPulse key={i} className="h-3 flex-1" />)}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-3 py-3 border-b border-gray-50 flex gap-4">
          {[1, 2, 3, 4].map(j => <SkeletonPulse key={j} className={`h-3 flex-1 ${j === 1 ? "w-2/5" : ""}`} />)}
        </div>
      ))}
    </div>
  );
}

function CardsSkeleton({ cols = 4 }: { cols: number }) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-${cols} gap-3`}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
          <SkeletonPulse className="h-6 w-1/2" />
          <SkeletonPulse className="h-3 w-3/4" />
          <SkeletonPulse className="h-2 w-1/3" />
        </div>
      ))}
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <SkeletonPulse className="h-7 w-64" />
        <SkeletonPulse className="h-4 w-48" />
      </div>
      <CardsSkeleton cols={4} />
      <TableSkeleton rows={5} />
    </div>
  );
}

export default function LoadingSkeleton({ lines = 3, type = "text", rows = 5, cols = 4 }: LoadingSkeletonProps) {
  switch (type) {
    case "table": return <TableSkeleton rows={rows} />;
    case "cards": return <CardsSkeleton cols={cols} />;
    case "page": return <PageSkeleton />;
    default: return <TextSkeleton lines={lines} />;
  }
}
