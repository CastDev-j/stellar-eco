import { Container } from "@/components/ui/container";
import Skeleton from "@/components/ui/skeleton";
import React from "react";

const IssTrackerLoading = () => {
  return (
    <Container className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-stone-50 rounded-lg">
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-6 w-20" />
          </div>

          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-20" />
          </div>

          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-6 w-16" />
          </div>

          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-16" />
          </div>

          <div className="md:col-span-2">
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <Skeleton className="h-4 w-64 mx-auto" />
      </section>
    </Container>
  );
};

export default IssTrackerLoading;
