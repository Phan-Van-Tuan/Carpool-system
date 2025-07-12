import { GeoJson } from "./base";

export type PlacePrediction = {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
};
