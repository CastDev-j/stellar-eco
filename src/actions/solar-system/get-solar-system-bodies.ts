"use server";

interface SolarSystemBodyResponse {
  id: string;
  name: string;
  englishName: string;
  isPlanet: boolean;
  mass?: {
    massValue: number;
    massExponent: number;
  };
  vol?: {
    volValue: number;
    volExponent: number;
  };
  density?: number;
  gravity?: number;
  meanRadius?: number;
}

export interface SolarSystemBody {
  id: string;
  name: string;
  englishName: string;
  isPlanet: boolean;
  mass?: {
    massValue: number;
    massExponent: number;
  };
  vol?: {
    volValue: number;
    volExponent: number;
  };
  density?: number;
  gravity?: number;
  meanRadius?: number;
}

const SolarSystemAPIBaseURL = `https://api.le-systeme-solaire.net/rest/bodies`;

const SOLAR_SYSTEM_API_KEY = process.env.SOLAR_SYSTEM_API_KEY || "";

export async function getSolarSystemBodies(): Promise<SolarSystemBody[]> {
  try {
    const response = await fetch(
      `${SolarSystemAPIBaseURL}?filter[]=isPlanet,eq,true`,
      {
        headers: {
          Authorization: `Bearer ${SOLAR_SYSTEM_API_KEY}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch solar system data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.bodies;
  } catch (error) {
    console.error("Error fetching solar system bodies:", error);
    throw error;
  }
}

export default getSolarSystemBodies;
