export default function InfoRow({
  icon,
  value,
}: {
  icon: React.ReactNode;

  value: string;
}) {
  return (
    <div className="flex w-full items-center gap-3 min-w-0">
      <span className="text-slate-500 shrink-0">{icon}</span>
      <span className="ml-3 font-medium shrink-0 whitespace-nowrap tabular-nums">
        {value}
      </span>
    </div>
  );
}
