import { Container } from "@/components/ui/container";
import SolarSystemComponent from "@/modules/solar-system/components/solar-system-component";

export default async function ApodPage() {
  return (
    <Container className="space-y-8">
      <SolarSystemComponent />
    </Container>
  );
}
