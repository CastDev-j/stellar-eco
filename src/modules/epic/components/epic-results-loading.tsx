"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import Skeleton from "@/components/ui/skeleton";

const EPICResultsLoading: React.FC = () => {
  return (
    <Container className="space-y-6" padding={false}>
      <div className="border-b border-stone-200">
        <div className="container flex justify-between py-4">
          <Skeleton className="w-30 h-10" />
          <Skeleton className="w-46 h-10 rounded-full" />
        </div>
      </div>

      <div className="flex">
        <Skeleton className="sm:w-56 w-24 h-10" />
      </div>

      <div className="space-y-4">
        <div className="relative max-w-2xl mx-auto">
          <div className="rounded-lg overflow-hidden">
            <Skeleton className="w-full aspect-square" />
          </div>

          <Skeleton className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full" />
          <Skeleton className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full" />
        </div>

        <div className="flex gap-2 justify-center flex-wrap max-w-4xl mx-auto">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="w-16 h-16 rounded-md" />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default EPICResultsLoading;
