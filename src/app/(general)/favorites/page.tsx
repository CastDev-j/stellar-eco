import { Container } from "@/components/ui/container";
import { Paragraph } from "@/components/ui/paragraph";
import { Title } from "@/components/ui/title";
import { Highlight } from "@/components/ui/highlight";
import APODTEST from "@/modules/apod/components/test";

const EonetPage = async () => {
  return (
    <Container className="space-y-8">
      <section className="space-y-4">
        <Title variant="h1" align="center">
          Favoritos
        </Title>
        <Paragraph size="lg" align="center">
          Guarda y organiza tus{" "}
          <Highlight variant="indigo">favoritos</Highlight> para acceder
          rápidamente a eventos, alertas e información relevante desde cualquier
          lugar.
        </Paragraph>
      </section>

      <APODTEST />
    </Container>
  );
};

export default EonetPage;
