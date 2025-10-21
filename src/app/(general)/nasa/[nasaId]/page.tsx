"use client";

import { Container } from "@/components/ui/container";
import NasaDetailsById from "@/modules/nasa-image-video/components/nasa-details-by-id";
import { useParams } from "next/navigation";

const NasaImageVideoByIdPage = () => {
  const { nasaId } = useParams<{ nasaId: string }>();

  return (
    <Container className="space-y-8">
      <NasaDetailsById nasaId={nasaId!} />
    </Container>
  );
};

export default NasaImageVideoByIdPage;
