interface ISSPositionResponse {
  name: string;
  id: number;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility: string;
  footprint: number;
  timestamp: number;
  daynum: number;
  solar_lat: number;
  solar_lon: number;
  units: string;
}

export interface ISSPosition {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  timestamp: number;
}

const ISSTrackerAPIBaseURL = `https://api.wheretheiss.at/v1/satellites`;

export async function actionGetISSPosition({
  queryKey,
}: {
  queryKey: [string];
}): Promise<ISSPosition> {
  const satelliteId = 25544;

  const response = await fetch(`${ISSTrackerAPIBaseURL}/${satelliteId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch ISS position");
  }

  const data: ISSPositionResponse = await response.json();

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    altitude: data.altitude,
    velocity: data.velocity,
    timestamp: data.timestamp,
  };
}

export default actionGetISSPosition;
