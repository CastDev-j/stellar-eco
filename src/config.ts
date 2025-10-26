interface Route {
  label: string;
  path: string;
}

export const routes: Route[] = [
  { label: "Inicio", path: "/" },
  { label: "Where is ISS", path: "/iss" },
  { label: "NASA Image and Video Library", path: "/nasa" },
  { label: "Solar System", path: "/solar-system" },
  { label: "EPIC", path: "/epic" },
  { label: "Favoritos", path: "/favorites" },
];

export const authors = [
  "Andrés Castillo Jiménez",
  "Sugey Gutiérrez Calero",
  "Angel González Mejia",
  "Gibran Aron Herrera Herrera",
];
export const githubRepo = "https://github.com/CastDev-j/stellar-eco";
export const SITE_NAME = "Ecos Estelares";

export const itemsPerPageOptions = {
  nasa: 12,
  iss: 12,
  epic: 6,
  solar_system: 1,
};
