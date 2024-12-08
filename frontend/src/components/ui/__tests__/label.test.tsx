import { render } from "@testing-library/react";
import { Label } from "../label";

describe("Label component", () => {
  it("should render with default props", () => {
    const { getByText } = render(<Label>Test Label</Label>);
    expect(getByText("Test Label")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <Label className="custom-class">Test Label</Label>,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should forward additional props", () => {
    const { getByText } = render(<Label data-testid="label">Test Label</Label>);
    expect(getByText("Test Label")).toHaveAttribute("data-testid", "label");
  });
});
