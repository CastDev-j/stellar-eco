import { Container } from "@/components/ui/container";
import { Paragraph } from "@/components/ui/paragraph";
import { Title } from "@/components/ui/title";
import Hero from "@/modules/index/components/hero";

export default function Home() {
  return (
    <Container className="space-y-12" animated={false}>
      {/*Hero */}
      <Hero />
      {/* Header */}
      <section className="space-y-4 min-h-[80vh] flex items-center justify-center ">
        <div className="-mt-16 flex flex-col gap-4">
          <Title
            variant="h1"
            align="center"
            className="text-white animate-fade-up animate-once animate-ease-in"
          >
            Ecos Estelares
          </Title>
          <Paragraph
            size="sm"
            align="center"
            className="text-white/70 animate-fade-up animate-once animate-delay-100 animate-ease-in"
          >
            Explora misiones espaciales y descubrimientos astronómicos de la
            NASA.
          </Paragraph>
        </div>
      </section>
    </Container>
  );
}
