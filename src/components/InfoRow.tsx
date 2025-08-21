export default function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 min-w-0 w-full">
      <span className="text-slate-500 shrink-0">{icon}</span>
      <span className="text-slate-500 flex-1 min-w-0 truncate">{label}</span>
      <span className="ml-3 font-medium shrink-0 whitespace-nowrap tabular-nums">{value}</span>
    </div>
  );
}
