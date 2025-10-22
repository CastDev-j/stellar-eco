import { Container } from "@/components/ui/container";
import EPICImageFilter from "@/modules/epic/components/epic-image-filter";
import { Suspense } from "react";

const EpicPage = async () => {
  return (
    <Container className="space-y-8">
      <Suspense>
        <EPICImageFilter />
      </Suspense>
    </Container>
  );
};

export default EpicPage;
