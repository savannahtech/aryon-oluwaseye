import { render } from "@testing-library/react";
import RiskScoreIndicator from "../risk-indicator";

describe("RiskScoreIndicator", () => {
  it("renders with no fill when score is 0", () => {
    const { container } = render(<RiskScoreIndicator score={0} />);
    const fills = container.querySelectorAll(".absolute");
    expect(fills).toHaveLength(4);
    fills.forEach((fill) => {
      expect(fill).toHaveStyle({ width: "0%" });
    });
  });

  it("renders with full fill in first box when score is 25", () => {
    const { container } = render(<RiskScoreIndicator score={25} />);
    const fills = container.querySelectorAll(".absolute");
    expect(fills[0]).toHaveStyle({ width: "100%" });
    expect(fills[1]).toHaveStyle({ width: "0%" });
    expect(fills[2]).toHaveStyle({ width: "0%" });
    expect(fills[3]).toHaveStyle({ width: "0%" });
  });

  it("renders with partial fill when score is between thresholds", () => {
    const { container } = render(<RiskScoreIndicator score={35} />);
    const fills = container.querySelectorAll(".absolute");
    expect(fills[0]).toHaveStyle({ width: "100%" });
    expect(fills[1]).toHaveStyle({ width: "40%" });
    expect(fills[2]).toHaveStyle({ width: "0%" });
    expect(fills[3]).toHaveStyle({ width: "0%" });
  });

  it("renders with full fill in all boxes when score is 100", () => {
    const { container } = render(<RiskScoreIndicator score={100} />);
    const fills = container.querySelectorAll(".absolute");
    fills.forEach((fill) => {
      expect(fill).toHaveStyle({ width: "100%" });
    });
  });

  it("normalizes scores above 100 to 100", () => {
    const { container } = render(<RiskScoreIndicator score={150} />);
    const fills = container.querySelectorAll(".absolute");
    fills.forEach((fill) => {
      expect(fill).toHaveStyle({ width: "100%" });
    });
  });
});
