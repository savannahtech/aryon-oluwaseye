import toast from "react-hot-toast";
import { CloudProvider } from "@/types";

export const toastError = (err: unknown) => {
  const message = (err as any)?.response?.data?.error || "An error occured";
  toast.error(message, { duration: 7 * 1000 });
};

export const CloudIcons = {
  [CloudProvider.AWS]: "/aws.png",
  [CloudProvider.AZURE]: "/azure.png",
  [CloudProvider.UNSPECIFIED]: "/cloud.png",
};

import { RouterHistory } from "@tanstack/react-router";

import { createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";

export function routerFactory(history?: RouterHistory) {
  return createRouter({
    history,
    routeTree,
  });
}
