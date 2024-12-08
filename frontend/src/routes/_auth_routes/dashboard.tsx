import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth_routes/dashboard")({
  component: () => <OtherPages title="Dashboard" />,
});

function OtherPages({ title }: { title: string }) {
  return (
    <div>
      <div className="flex items-center gap-8">
        <h2 className="text-3xl font-semibold">{title}</h2>
        <Link to="/recommendations">
          <Button className="bg-teal-600 hover:bg-teal-900">
            View Recommendations
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default OtherPages;
