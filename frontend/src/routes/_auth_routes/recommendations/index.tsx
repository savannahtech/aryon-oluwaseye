import { useState, Fragment, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Archive, ChevronRight, Menu, Sparkles } from "lucide-react";
import {
  getArchivedRecommendations,
  getRecommendations,
} from "@/services/recommendations";
import useDebounce from "@/hook/useDebounce";
import { Recommendation } from "@/types";
import FilterBar from "@/components/dashboard/filter-bar";
import RecommendationCard from "@/components/dashboard/recommendation-card";
import ArchiveIcon from "@/assets/archive";
import useStore from "@/store";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const Route = createFileRoute("/_auth_routes/recommendations/")({
  component: () => <Dashboard isArchived={false} />,
});

function Dashboard({ isArchived }: { isArchived: boolean }) {
  const { toggleMenu } = useStore();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<{
    providers: string[];
    frameworks: string[];
    classes: string[];
    reasons: string[];
  }>({
    providers: [],
    frameworks: [],
    classes: [],
    reasons: [],
  });

  const debouncedSearch = useDebounce(search, 900);

  const { data, fetchNextPage, isLoading, isError, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        isArchived ? "recommendations/archive" : "recommendations",
        debouncedSearch,
        filters,
      ],
      initialPageParam: undefined,
      queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
        const res = isArchived
          ? getArchivedRecommendations
          : getRecommendations;
        return res({
          cursor: pageParam,
          limit: 10,
          search: debouncedSearch,
          tags: [
            ...filters.providers,
            ...filters.frameworks,
            ...filters.classes,
            ...filters.reasons,
          ].join(","),
        });
      },
      getNextPageParam: (lastPage) =>
        lastPage.pagination.cursor.next || undefined,
    });

  const { ref, inView } = useInView({
    threshold: 0.8,
  });

  useEffect(() => {
    if (inView) {
      if (
        (data?.pages.reduce((acc, page) => acc + page.data.length, 0) ?? 0) <
        (data?.pages[0]?.pagination.totalItems ?? 0)
      )
        fetchNextPage();
    }
  }, [inView]);

  return (
    <div>
      <div>
        <div className={`flex gap-4 md:items-center`}>
          <Menu className="md:hidden" onClick={() => toggleMenu()} />
          {isArchived ? (
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/recommendations">
                    Recommendations
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/recommendations/archived">
                    Archive
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          ) : null}
        </div>

        <div className="mb-4 flex grow flex-wrap items-center justify-between gap-2">
          <h2 className="text-3xl font-semibold">
            {isArchived ? (
              <span className="flex items-center gap-2">
                Recommendations Archived
                <Archive />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Recommendations
                <Sparkles className="h-5 w-5 fill-teal-600 text-teal-600" />
              </span>
            )}
          </h2>
          {!isArchived ? (
            <Link to="/recommendations/archived">
              <Button variant="ghost">
                <ArchiveIcon />
                Archive
              </Button>
            </Link>
          ) : null}
        </div>

        <FilterBar
          showing={
            data?.pages.reduce((acc, page) => acc + page.data.length, 0) || 0
          }
          total={data?.pages[0].pagination.totalItems || 0}
          search={search}
          onSearchChange={setSearch}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      <div
        data-testid="recommendations-list"
        className="recommendations-list relative flex h-[calc(100dvh-226px)] flex-col gap-3 overflow-y-auto pb-4 md:h-[calc(100dvh-158px)]"
      >
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error loading recommendations</div>}
        {!isLoading &&
          !isError &&
          data?.pages.map((page, pageIndex) => (
            <Fragment key={pageIndex}>
              {page.data.map((recommendation: Recommendation, index) =>
                index === page.data.length - 1 ? (
                  <div ref={ref} key={recommendation.recommendationId}>
                    <RecommendationCard
                      archive={isArchived}
                      key={recommendation.recommendationId}
                      recommendation={recommendation}
                    />
                  </div>
                ) : (
                  <RecommendationCard
                    archive={isArchived}
                    key={recommendation.recommendationId}
                    recommendation={recommendation}
                  />
                ),
              )}
            </Fragment>
          ))}
        {!isLoading &&
          !isError &&
          data?.pages.reduce((acc, page) => acc + page.data.length, 0) ===
            0 && (
            <div className="mt-8 text-center">No recommendations found</div>
          )}
        {isFetchingNextPage && (
          <div className="relative bottom-5 flex justify-center bg-transparent py-1">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-400 border-t-teal-100"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
