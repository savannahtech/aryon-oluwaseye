import api from "../api";
import { ArchiveRes, RecommendationsParams, RecommendationsRes } from "./types";

export const getRecommendations = async (params: RecommendationsParams) => {
  const response = await api.get<RecommendationsRes>("/recommendations", {
    params,
  });
  return response.data;
};

export const getArchivedRecommendations = async (
  params: RecommendationsParams,
) => {
  const response = await api.get<RecommendationsRes>(
    "/recommendations/archive",
    {
      params,
    },
  );
  return response.data;
};

export const archiveRecommendation = async (id: string) => {
  const response = await api.post<ArchiveRes>(`/recommendations/${id}/archive`);
  return response.data;
};

export const unarchiveRecommendation = async (id: string) => {
  const response = await api.post<ArchiveRes>(
    `/recommendations/${id}/unarchive`,
  );
  return response.data;
};
