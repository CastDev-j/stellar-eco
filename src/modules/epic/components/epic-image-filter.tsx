"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/ui/container";
import Button from "@/components/ui/button";
import { IoMdClose } from "react-icons/io";
import QueryError from "@/components/ui/error";
import { fetchEPICImages } from "@/actions/epic/get-epic-images";
import EPICResultsLoading from "./epic-results-loading";
import EPICDefaultComponent from "./epic-default-component";
import EPICResults from "./epic-results";
import { IoArrowBack } from "react-icons/io5";

interface Props {
  initialState?: number;
}

const EPICImageFilter = ({ initialState }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dateParam = searchParams.get("date") || "";

  const [selectedDate, setSelectedDate] = useState(dateParam);

  useEffect(() => {
    setSelectedDate(dateParam);
  }, [dateParam]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["EPIC", dateParam],
    queryFn: () => fetchEPICImages(dateParam),
    enabled: dateParam.trim() !== "",
    placeholderData: (prev) => prev,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    router.push(`?date=${selectedDate}`);
  };

  const handleClearFilters = () => {
    setSelectedDate("");
    router.replace(window.location.pathname);
  };

  const handleRetry = () => {
    refetch();
  };

  const hasActiveFilter = dateParam.trim() !== "";

  return (
    <Container className="space-y-8" padding={false}>
      <section className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min="2015-06-13"
            max="2025-07-15"
            className="flex-1 w-fit"
            placeholder="Selecciona una fecha"
          />

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={!selectedDate} className="px-6">
              Buscar
            </Button>

            {hasActiveFilter && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleClearFilters}
                className="px-4"
              >
                <IoMdClose />
              </Button>
            )}
          </div>
        </form>
      </section>

      <section className="space-y-6">
        {!isLoading && !data && !error && <EPICDefaultComponent />}

        {isLoading && <EPICResultsLoading />}

        {data && (
          <EPICResults
            data={data}
            date={selectedDate}
            initialState={initialState}
          />
        )}

        {error && <QueryError error={error} onRetry={handleRetry} />}
      </section>
    </Container>
  );
};

export default EPICImageFilter;
