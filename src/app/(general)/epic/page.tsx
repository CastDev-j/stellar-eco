import { getIsFavorite } from "@/actions/favorites/get-is-favorite";
import { Container } from "@/components/ui/container";
import EPICImageFilter from "@/modules/epic/components/epic-image-filter";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<{ date?: string; page?: string }>;
}

const EpicPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const { userId } = await auth();

  const date = params.date;

  let initialState = 0;

  if (userId && date)
    initialState = await getIsFavorite({
      type: "epic",
      date,
      userId,
    });

  return (
    <Container className="space-y-8">
      <Suspense>
        <EPICImageFilter initialState={initialState} />
      </Suspense>
    </Container>
  );
};

export default EpicPage;
