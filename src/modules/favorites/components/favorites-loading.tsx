import React from "react";
import Skeleton from "@/components/ui/skeleton";
import { Container } from "@/components/ui/container";

const FavoritesLoading = () => {
  return (
    <Container className="space-y-8">
      <section className="space-y-2">
        <Skeleton className="h-10 w-80 mx-auto rounded-lg" />
        <Skeleton className="h-6 w-64 mx-auto rounded-lg" />
      </section>

      <section className="space-y-3">
        <Skeleton className="h-8 w-96 rounded-lg" />
        <div className="space-y-2 pl-6">
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-5 w-4/5 rounded" />
        </div>
      </section>

      <section className="space-y-3">
        <Skeleton className="h-8 w-80 rounded-lg" />
        <div className="space-y-2 pl-6">
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-5 w-5/6 rounded" />
        </div>
      </section>

      <section className="space-y-3">
        <Skeleton className="h-8 w-72 rounded-lg" />
        <div className="space-y-2 pl-6">
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-5 w-3/4 rounded" />
          <Skeleton className="h-5 w-5/6 rounded" />
        </div>
      </section>

      <section className="space-y-3">
        <Skeleton className="h-8 w-64 rounded-lg" />
        <div className="space-y-2 pl-6">
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-5 w-4/5 rounded" />
          <Skeleton className="h-5 w-full rounded" />
        </div>
      </section>

      <section className="pt-4 border-t border-stone-200">
        <Skeleton className="h-4 w-96 mx-auto rounded" />
      </section>
    </Container>
  );
};

export default FavoritesLoading;
