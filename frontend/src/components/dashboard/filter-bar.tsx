import React, { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "../ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Checkbox } from "../ui/checkbox";
import { getRecommendations } from "@/services/recommendations";
import { Filter } from "lucide-react";

interface FilterBarProps {
  total: number;
  showing: number;
  search: string;
  onSearchChange: (value: string) => void;
  availableTags?: {
    frameworks: string[];
    providers: string[];
    reasons: string[];
    classes: string[];
  };
  filters: {
    providers: string[];
    frameworks: string[];
    classes: string[];
    reasons: string[];
  };
  onFiltersChange: (filters: {
    providers: string[];
    frameworks: string[];
    classes: string[];
    reasons: string[];
  }) => void;
}

function FilterBar({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  total,
  showing,
}: FilterBarProps) {
  const toggleFilter = useCallback(
    (
      type: "providers" | "frameworks" | "classes" | "reasons",
      value: string,
    ) => {
      const currentFilters = filters[type];
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter((item) => item !== value)
        : [...currentFilters, value];

      onFiltersChange({
        ...filters,
        [type]: newFilters,
      });
    },
    [filters, onFiltersChange],
  );

  const data = useQuery({
    queryKey: ["availableTags"],
    queryFn: async () =>
      await getRecommendations({
        limit: 1,
      }),
  });

  const availableTags = data.data?.availableTags;

  const AccordionList = useMemo(
    () => [
      {
        title: "Cloud Providers",
        children: (
          <>
            {availableTags?.providers.map((provider) => (
              <div
                key={provider}
                className="flex items-center gap-2 py-1 text-sm capitalize first:pt-0 last:pb-0"
              >
                <Checkbox
                  id={provider}
                  checked={filters.providers.includes(provider)}
                  onCheckedChange={() => toggleFilter("providers", provider)}
                />
                <label htmlFor={provider} className="text-sm leading-none">
                  {provider.toLowerCase()}
                </label>
              </div>
            ))}
          </>
        ),
      },
      {
        title: "Frameworks",
        children: (
          <>
            {availableTags?.frameworks.map((framework) => (
              <div
                key={framework}
                className="flex items-center gap-2 py-1 text-sm capitalize first:pt-0 last:pb-0"
              >
                <Checkbox
                  id={framework}
                  checked={filters.frameworks.includes(framework)}
                  onCheckedChange={() => toggleFilter("frameworks", framework)}
                />
                <label htmlFor={framework} className="text-sm leading-none">
                  {framework.toLowerCase()}
                </label>
              </div>
            ))}
          </>
        ),
      },

      {
        title: "Classes",
        children: (
          <>
            {availableTags?.classes.map((class_) => (
              <div
                key={class_}
                className="flex items-center gap-2 py-1 text-sm capitalize first:pt-0 last:pb-0"
              >
                <Checkbox
                  id={class_}
                  checked={filters.classes.includes(class_)}
                  onCheckedChange={() => toggleFilter("classes", class_)}
                />
                <label htmlFor={class_} className="text-sm leading-none">
                  {class_.toLowerCase().replace(/_/g, " ")}
                </label>
              </div>
            ))}
          </>
        ),
      },
      {
        title: "Reasons",
        children: (
          <>
            {availableTags?.reasons.map((reason) => (
              <div
                key={reason}
                className="flex items-center gap-2 py-1 text-sm capitalize first:pt-0 last:pb-0"
              >
                <Checkbox
                  id={reason}
                  checked={filters.reasons.includes(reason)}
                  onCheckedChange={() => toggleFilter("reasons", reason)}
                />
                <label htmlFor={reason} className="text-sm leading-none">
                  {reason.toLowerCase()}
                </label>
              </div>
            ))}
          </>
        ),
      },
    ],
    [availableTags, filters, toggleFilter],
  );

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex grow items-center gap-2 md:grow-0">
          <Input
            type="text"
            className="w-64 grow bg-white md:grow-0"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search recommendations..."
          />

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border-[1.5px] border-teal-600 bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-white hover:text-teal-600">
              <Filter className="h-4 w-4" />
              Filters{" "}
              {filters.providers.length +
                filters.frameworks.length +
                filters.classes.length +
                filters.reasons.length >
                0 &&
                `(${filters.providers.length + filters.frameworks.length + filters.classes.length + filters.reasons.length})`}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="z-10 mt-2 h-auto max-h-96 w-80 overflow-y-auto rounded-lg border bg-gray-50 p-1.5 md:left-0"
            >
              <Accordion
                type="multiple"
                className="w-full space-y-1"
                defaultValue={["0"]}
              >
                {AccordionList.map((item, index) => (
                  <AccordionItem
                    key={index}
                    className="rounded-md border"
                    value={index.toString()}
                  >
                    <AccordionTrigger className="flex w-full items-center justify-between rounded-md bg-white px-2 py-1.5 text-sm">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="rounded-b-md border-t bg-white px-2 py-2">
                      {item.children}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-medium w-full text-center text-sm text-gray-600 md:w-fit">
          Showing {showing > total ? total : showing} of {total} results
        </p>
      </div>
    </div>
  );
}

export default React.memo(FilterBar);
