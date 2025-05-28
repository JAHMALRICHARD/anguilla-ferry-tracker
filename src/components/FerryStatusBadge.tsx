export function FerryStatusBadge({ status }: { status: string }) {
  const formatted = status.replace("-", " ").toUpperCase();

  const className = `text-xs py-1 px-2 rounded-sm leading-none font-semibold uppercase ${
    status === "on-time"
      ? "bg-green-500/10 text-green-400"
      : status === "delayed"
      ? "bg-yellow-500/10 text-yellow-400"
      : status === "cancelled"
      ? "bg-red-500/10 text-red-400"
      : status === "arrived"
      ? "bg-green-500/10 text-green-400"
      : status === "sailing"
      ? "bg-blue-500/10 text-blue-400"
      : "bg-gray-500/10 text-gray-400"
  }`;

  return <span className={className}>{formatted}</span>;
}
