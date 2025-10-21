import { Container } from "@/components/ui/container";
import SearchImageAndVideo from "@/modules/nasa-image-video/components/search";
import { Suspense } from "react";

const NasaImageVideoPage = () => {
  return (
    <Container className="space-y-12 min-h-[85vh]">
      <Suspense>
        <SearchImageAndVideo />
      </Suspense>
    </Container>
  );
};

export default NasaImageVideoPage;
