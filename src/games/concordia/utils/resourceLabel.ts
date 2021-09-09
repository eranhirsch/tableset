import { Resource } from "./CityResourcesEncoder";

export default function resourceName(resource: Resource): string {
  switch (resource) {
    case "bricks":
      return "Bricks";
    case "food":
      return "Food";
    case "tools":
      return "Tools";
    case "wine":
      return "Wine";
    case "cloth":
      return "Cloth";
  }
}
