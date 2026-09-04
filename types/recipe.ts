export type ImageStatus = "loading" | "ready" | "error";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  imageStatus: ImageStatus;
  prepTime: string;
  ingredients: string[];
  steps: string[];
}
