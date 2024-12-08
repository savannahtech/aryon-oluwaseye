import { createFileRoute } from "@tanstack/react-router";
import OtherPages from "./dashboard";

export const Route = createFileRoute("/_auth_routes/events")({
  component: () => <OtherPages title="Events" />,
});
