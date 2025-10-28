import { getSolarSystemFavorites } from "@/actions/solar-system/get-solar-system-favorites";
import SolarSystemComponent from "@/modules/solar-system/components/solar-system-component";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

export default async function ApodPage() {
  const { userId } = await auth();

  const solarSystem = userId ? await getSolarSystemFavorites() : null;

  return (
    <Suspense>
      <SolarSystemComponent initialFavorites={solarSystem} />
    </Suspense>
  );
}
