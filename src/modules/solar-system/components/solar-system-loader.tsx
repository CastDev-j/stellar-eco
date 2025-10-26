import React from "react";
import Skeleton from "@/components/ui/skeleton";
import { Container } from "@/components/ui/container";

const SolarSystemLoading = () => {
  return (
    <Container className="space-y-8">
      <section className="space-y-4">
        <Skeleton className="h-8 w-72 rounded-lg" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="p-4 bg-stone-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24 rounded" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-4 w-28 rounded" />
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
};

export default SolarSystemLoading;
