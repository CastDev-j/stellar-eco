import { getAllCategoriesFavorites } from "@/actions/favorites/get-all-categories-favorites";
import { getSolarSystemFavorites } from "@/actions/solar-system/get-solar-system-favorites";
import { Container } from "@/components/ui/container";
import SolarSystemComponent from "@/modules/solar-system/components/solar-system-component";
import { auth } from "@clerk/nextjs/server";

export default async function ApodPage() {
  const { userId } = await auth();

  const solarSystem = userId ? await getSolarSystemFavorites() : null;

  return (
    <Container className="space-y-8 min-h-[85vh]">
      <SolarSystemComponent initialFavorites={solarSystem} />
    </Container>
  );
}
