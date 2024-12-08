import { Recommendation } from "../../types";

export type RecommendationsParams = {
  cursor?: string;
  limit?: number;
  search?: string;
  tags?: string;
};

export type RecommendationsRes = {
  data: Recommendation[];
  pagination: {
    cursor: {
      next: string | null;
    };
    totalItems: number;
  };
  availableTags: {
    frameworks: string[];
    reasons: string[];
    providers: string[];
    classes: string[];
  };
};

export type ArchiveRes = {
  success: boolean;
};
