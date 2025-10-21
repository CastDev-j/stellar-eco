import { getIsFavorite } from "@/actions/favorites/get-is-favorite";
import { Container } from "@/components/ui/container";
import NasaDetailsById from "@/modules/nasa-image-video/components/nasa-details-by-id";
import { auth } from "@clerk/nextjs/server";

interface Props {
  params: Promise<{ nasaId: string }>;
}

const NasaImageVideoByIdPage = async ({ params }: Props) => {
  const { nasaId: encodedNasaId } = await params;
  const { userId } = await auth();

  const nasaId = decodeURIComponent(encodedNasaId);

  let initialState = 0;

  if (userId)
    initialState = await getIsFavorite({
      type: "image_library",
      nasaId,
      userId,
    });

  return (
    <Container className="space-y-8">
      <NasaDetailsById nasaId={nasaId} initialState={initialState} />
    </Container>
  );
};

export default NasaImageVideoByIdPage;
