import { Container } from "@/components/ui/container";
import Skeleton from "@/components/ui/skeleton";
import React from "react";

const IssTrackerLoading = () => {
  return (
    <Container className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-indigo-200 shadow-sm">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-20" />
          </div>
          <div className="p-6 rounded-xl border border-indigo-200 shadow-sm">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-20" />
          </div>
          <div className="p-6 rounded-xl border border-green-200 shadow-sm">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-16" />
          </div>
          <div className="p-6 rounded-xl border border-yellow-200 shadow-sm">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-16" />
          </div>
        </div>
        <div className="p-4 bg-stone-100 rounded-lg border border-stone-200">
          <Skeleton className="h-4 w-40 mx-auto mb-1" />
          <Skeleton className="h-5 w-32 mx-auto" />
        </div>
        <Skeleton className="h-4 w-64 mx-auto" />
      </section>
    </Container>
  );
};

export default IssTrackerLoading;
