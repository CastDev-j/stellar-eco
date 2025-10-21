import { Container } from "@/components/ui/container";
import { Paragraph } from "@/components/ui/paragraph";
import { Title } from "@/components/ui/title";
import { Highlight } from "@/components/ui/highlight";
import APODTEST from "@/modules/apod/components/test";

export default async function ApodPage() {
  return (
    <Container className="space-y-8">
      <section className="space-y-4">
        <Title variant="h1" align="center">
          Astronomy Picture of the Day
        </Title>
        <Paragraph size="lg" align="center">
          Descubre la{" "}
          <Highlight variant="indigo">imagen astronómica del día</Highlight>{" "}
          seleccionada por la NASA. Cada día presenta una fotografía diferente
          del universo, acompañada de una explicación escrita por astrónomos
          profesionales.
        </Paragraph>
      </section>

      <APODTEST />
    </Container>
  );
}
