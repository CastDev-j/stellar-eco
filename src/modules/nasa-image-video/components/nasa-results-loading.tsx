import React from "react";
import { Container } from "@/components/ui/container";
import Skeleton from "@/components/ui/skeleton";

interface Props {
  itemCount?: number;
}

const NASAResultsLoading: React.FC<Props> = ({ itemCount = 9 }) => {
  return (
    <Container className="space-y-8" padding={false}>
      <section className="space-y-4 mt-6">
        <Skeleton className="w-72 h-9 rounded-sm" rounded={false} />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: itemCount }).map((_, index) => (
          <article key={index} className="bg-white rounded-sm overflow-hidden">
            <Skeleton className="w-full h-48" rounded={false} />

            <div className="p-4 space-y-3">
              <Skeleton className="w-full h-7" />
              <Skeleton className="w-4/5 h-7" />

              <div className="flex items-center gap-2">
                <Skeleton className="w-15 h-4" />
                <Skeleton className="w-1 h-1 rounded-full" />
                <Skeleton className="w-30 h-4" />
              </div>

              <div className="space-y-2">
                <Skeleton className="w-full h-3.5" />
                <Skeleton className="w-full h-3.5" />
                <Skeleton className="w-[85%] h-3.5" />
              </div>

              <div className="flex flex-wrap gap-1">
                <Skeleton className="w-[70px] h-6" />
                <Skeleton className="w-[85px] h-6" />
                <Skeleton className="w-15 h-6" />
              </div>

              <Skeleton className="w-35 h-3" />
            </div>
          </article>
        ))}
      </div>
    </Container>
  );
};

export default NASAResultsLoading;
