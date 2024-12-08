import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RecommendationCard from "../recommendation-card";

describe("RecommendationCard", () => {
  const queryClient = new QueryClient();

  const mockRecommendation = {
    tenantId: "tenant-001",
    recommendationId: "rec-001",
    title: "AWS EC2 Instance Data Protection Configuration",
    slug: "aws-ec2-instance-data-protection-configuration",
    description:
      "Implement comprehensive data protection controls for AWS EC2 Instance including security best practices, monitoring, and compliance requirements.",
    score: 93,
    provider: [1],
    frameworks: [
      {
        name: "AWS Well-Architected",
        section: "Security",
        subsection: "Reliability.1",
      },
      {
        name: "Azure Security Benchmark",
        section: "3",
        subsection: "5.3",
      },
    ],
    reasons: [
      "Enhances data protection security",
      "Reduces security risks",
      "Ensures compliance requirements",
    ],
    furtherReading: [
      {
        name: "AWS EC2 Instance Security Guide",
        href: "https://docs.example.com/aws/ec2 instance/security",
      },
    ],
    totalHistoricalViolations: 187,
    affectedResources: [
      {
        name: "development-ec2-instance",
      },
      {
        name: "staging-ec2-instance",
      },
    ],
    impactAssessment: {
      totalViolations: 60,
      mostImpactedScope: {
        name: "staging-ec2-instance",
        type: "EC2 Instance",
        count: 40,
      },
    },
    class: 6,
  };

  it("renders recommendation title", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RecommendationCard
          archive={false}
          recommendation={mockRecommendation}
        />
      </QueryClientProvider>,
    );
    expect(screen.getByText(mockRecommendation.title)).toBeInTheDocument();
  });

  it("renders recommendation description", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RecommendationCard
          archive={false}
          recommendation={mockRecommendation}
        />
      </QueryClientProvider>,
    );
    expect(
      screen.getByText(mockRecommendation.description),
    ).toBeInTheDocument();
  });

  it("renders risk score", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RecommendationCard
          archive={false}
          recommendation={mockRecommendation}
        />
      </QueryClientProvider>,
    );
    expect(screen.getByText(/risk score:\(93\)/i)).toBeInTheDocument();
  });

  it("renders framework tags", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RecommendationCard
          archive={false}
          recommendation={mockRecommendation}
        />
      </QueryClientProvider>,
    );

    mockRecommendation.frameworks.forEach((framework) => {
      expect(screen.getByText(framework.name)).toBeInTheDocument();
    });
  });

  it("renders provider icons", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RecommendationCard
          archive={false}
          recommendation={mockRecommendation}
        />
      </QueryClientProvider>,
    );
    mockRecommendation.provider.forEach(() => {
      const imgs = screen.getAllByRole("img");
      expect(imgs).toHaveLength(mockRecommendation.provider.length);
    });
  });
});
