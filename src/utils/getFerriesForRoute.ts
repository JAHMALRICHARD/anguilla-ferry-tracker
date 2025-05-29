// utils/getFerriesForRoute.ts
import { FerryItem } from "../components/FerryProps";

export function getFerriesForRoute(
  routeTo: string,
  ferries: FerryItem[]
): FerryItem[] {
  if (routeTo === "To Anguilla - via Marigot") {
    return ferries.map((ferry) => {
      return {
        ...ferry,
        departure_port: ferry.arrival_port,
        arrival_port: ferry.departure_port,
        // keep departure_time unchanged!
      };
    });
  }

  return ferries;
}
