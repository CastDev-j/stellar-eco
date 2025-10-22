import { Container } from "@/components/ui/container";
import FavoritesComponent from "@/modules/favorites/components/favorites-component";

const FavoritesPage = async () => {
  return (
    <Container className="space-y-8">
      <FavoritesComponent />
    </Container>
  );
};

export default FavoritesPage;
