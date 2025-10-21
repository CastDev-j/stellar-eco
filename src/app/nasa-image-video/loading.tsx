import { Container } from "@/components/ui/container";
import { Title } from "@/components/ui/title";
import { Paragraph } from "@/components/ui/paragraph";
import Skeleton from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="space-y-8">
      <section className="space-y-4">
        <Title variant="h1" align="center" className="text-white">
          Cargando...
        </Title>
        <Paragraph align="center" className="text-white/70">
          Preparando datos del universo
        </Paragraph>
      </section>
      <div className="space-y-4">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    </Container>
  );
}