import React, { useCallback, useMemo } from "react";

const RiskScoreIndicator = ({ score }: { score: number }) => {
  const normalizedScore = Math.max(0, Math.min(100, score));

  const colors = ["#22c55e", "#84cc16", "#eab308", "#ef4444"];

  const getFillLevels = useCallback((score: number) => {
    const boxValue = 25;
    return Array(4)
      .fill(0)
      .map((_, index) => {
        const previousThreshold = boxValue * index;
        const boxScore = score - previousThreshold;

        if (boxScore <= 0) return 0;
        if (boxScore >= boxValue) return 100;
        return (boxScore / boxValue) * 100;
      });
  }, []);

  const fillLevels = useMemo(
    () => getFillLevels(normalizedScore),
    [getFillLevels, normalizedScore],
  );

  return (
    <div className="inline-flex gap-0.5">
      {fillLevels.map((level, index) => (
        <div
          key={index}
          className="relative h-3 w-3 overflow-hidden rounded-sm"
        >
          <div
            className="absolute bottom-0 h-full transition-[width] duration-300"
            style={{
              backgroundColor: colors[index],
              width: `${level}%`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default React.memo(RiskScoreIndicator);
