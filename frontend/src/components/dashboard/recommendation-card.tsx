import React from "react";
import {
  BookOpenText,
  Box,
  ChartColumnIncreasing,
  ExternalLink,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Recommendation } from "@/types";
import { CloudIcons, toastError } from "@/utils";
import RiskScoreIndicator from "./risk-indicator";
import { Badge } from "../ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import ArchiveIcon from "@/assets/archive";
import { PROVIDERS } from "@/constant";
import {
  archiveRecommendation,
  unarchiveRecommendation,
} from "@/services/recommendations";

interface Props {
  archive: boolean;
  recommendation: Recommendation;
}

function RecommendationCard({ archive, recommendation }: Props) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      archive
        ? unarchiveRecommendation(recommendation.recommendationId)
        : archiveRecommendation(recommendation.recommendationId),
    mutationKey: ["archive-recommendations"],
    onSuccess: async () => {
      toast.success(
        `Recommendation ${archive ? "unarchived" : "archived"} successfully`,
      );
      await queryClient.invalidateQueries({
        queryKey: ["recommendations"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["recommendations/archive"],
      });
    },
    onError: (err: unknown) => {
      toastError(err);
    },
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div
          data-testid="recommendation-item"
          className="flex cursor-pointer rounded-lg border border-gray-200 transition-all hover:shadow-md"
        >
          <div
            className={`grid shrink-0 place-content-center rounded-l-lg ${archive ? "bg-slate-300" : "bg-teal-600"} p-4 md:w-[12.5%]`}
          >
            <Box className="h-8 w-8 text-white" />
          </div>
          <div
            className={`flex flex-wrap justify-between gap-4 bg-white p-4 lg:flex-nowrap`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-between gap-2">
                <h3 className="text-xl font-semibold text-teal-700">
                  {recommendation.title}
                </h3>
                <div className="flex shrink-0 gap-2">
                  {recommendation.provider.map((provider) => (
                    <img
                      key={provider}
                      src={CloudIcons[provider]}
                      className="h-6 w-6 object-contain"
                    />
                  ))}
                </div>
              </div>
              <p className="line-clamp-3 text-gray-600">
                {recommendation.description}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {recommendation.frameworks.map((framework) => (
                  <Badge key={framework.name} variant="secondary">
                    {framework.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="shrink-0 grow rounded-md bg-gray-100 p-3 text-center">
              <p className="text-sm font-medium">Impact assessment</p>
              <p className="text-xs font-medium text-gray-500">
                ~{recommendation.impactAssessment.totalViolations} violations /
                month
              </p>
              <hr className="my-3 border-gray-300" />
              <div className="flex items-center justify-center gap-1 text-xs font-medium">
                Risk Score:
                <RiskScoreIndicator score={recommendation.score} />(
                {recommendation.score})
              </div>
            </div>
          </div>
        </div>
      </SheetTrigger>

      <SheetContent className="sm:max-w-[640px]">
        <div className="relative h-[calc(100dvh-88px)] overflow-y-scroll">
          <div className="flex flex-col gap-2.5 border-b pb-4">
            <h3 className="text-xl font-semibold text-teal-700">
              {recommendation.title}
            </h3>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center justify-center gap-1 text-xs font-medium">
                Risk Score:
                <RiskScoreIndicator score={recommendation.score} />(
                {recommendation.score})
              </div>

              <div className="flex shrink-0 gap-2">
                {recommendation.provider.map((provider) => (
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <img
                      key={provider}
                      src={CloudIcons[provider]}
                      className="h-6 w-6 object-contain"
                    />
                    {PROVIDERS[provider]}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {recommendation.frameworks.map((framework) => (
                <Badge key={framework.name} variant="secondary">
                  {framework.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 py-4">
            <p className="text-gray-600">{recommendation.description}</p>

            <div>
              <div className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                <h6 className="font-semibold">Resources enforced by policy</h6>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {recommendation.affectedResources.map((resource, idx) => (
                  <Badge
                    key={`resource-${idx}`}
                    variant="secondary"
                    className="capitalize"
                  >
                    {resource.name.replace(/-/g, " ")}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                <h6 className="font-semibold">Reasons</h6>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {recommendation.reasons.map((reason, idx) => (
                  <Badge key={`reason-${idx}`} variant="secondary">
                    {reason}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <ChartColumnIncreasing className="h-5 w-5" />
                <h6 className="font-semibold">Impact Assessment</h6>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="dark:border-primary-800 dark:bg-primary-900 rounded-lg border border-slate-200 bg-slate-100 p-5">
                  <div className="flex items-center justify-between">
                    <p>Overall</p>
                    <OctagonAlert className="h-4 w-4" />
                  </div>
                  <div className="mt-2 flex items-center justify-between font-semibold">
                    <h6>Violations</h6>
                    <h6>{recommendation.totalHistoricalViolations}</h6>
                  </div>
                </div>
                <div className="dark:border-primary-800 dark:bg-primary-900 rounded-lg border border-slate-200 bg-slate-100 p-5">
                  <div className="flex items-center justify-between">
                    <p>Most impacted scope</p>
                    <TriangleAlert className="h-4 w-4" />
                  </div>
                  <div className="mt-2 flex items-center justify-between font-semibold">
                    <div>
                      <h6>
                        {recommendation.impactAssessment.mostImpactedScope.name}
                      </h6>
                      <p className="small font-normal leading-none text-slate-500 dark:text-slate-400">
                        (
                        {recommendation.impactAssessment.mostImpactedScope.type}
                        )
                      </p>
                    </div>
                    <h6>
                      {recommendation.impactAssessment.mostImpactedScope.count}
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <BookOpenText className="h-5 w-5" />
                <h6 className="font-semibold">Further Reading</h6>
              </div>
              {recommendation.furtherReading.map((reading, idx) => (
                <p key={idx}>
                  <a
                    href={reading.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 underline"
                  >
                    <span>{reading.name}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-full border-t bg-white px-6 pb-4 pt-3">
          <div className="flex items-center justify-end gap-4">
            <Button
              variant="ghost"
              disabled={isPending}
              onClick={() => mutate()}
            >
              <ArchiveIcon />
              {archive ? "Unarchive" : "Archive"}
            </Button>

            <Button className="bg-teal-600 hover:bg-teal-800">
              Configure Policy
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default React.memo(RecommendationCard);
