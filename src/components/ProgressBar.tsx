export function ProgressBar({
  percent,
  color = "blue",
}: {
  percent: number;
  color?: "blue" | "green" | "gray";
}) {
  const colorClass =
    color === "blue"
      ? "bg-blue-500"
      : color === "green"
      ? "bg-green-500"
      : "bg-gray-400";

  return (
    <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
      <div
        className={`h-2 transition-all duration-500 ${colorClass}`}
        style={{ width: `${percent.toFixed(0)}%` }}
      />
    </div>
  );
}
