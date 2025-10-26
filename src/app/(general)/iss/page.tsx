import { Container } from "@/components/ui/container";
import { Paragraph } from "@/components/ui/paragraph";
import { Title } from "@/components/ui/title";
import { Highlight } from "@/components/ui/highlight";
import ISSTrackerComponent from "@/modules/iss/components/iss-tracker-component";

const ISSTrackerPage = () => {
  return (
    <Container className="space-y-8">
      <section className="space-y-4">
        <Title variant="h1" align="center">
          Where the ISS at?
        </Title>
        <Paragraph size="lg" align="center">
          Accede a la{" "}
          <Highlight variant="indigo">
            ubicación en tiempo real de la Estación Espacial Internacional
          </Highlight>{" "}
          rastreada por satélites.
        </Paragraph>
      </section>

      <ISSTrackerComponent />
    </Container>
  );
};

export default ISSTrackerPage;
