export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <div className="mb-3 text-slate-500">Enter a place in Germany to see the forecast.</div>
      <div className="text-sm text-slate-500">
        Examples: "Sylt", "Kiel", "Fehmarn", "Husum", "Norderney", "Rügen", "St. Peter-Ording"
      </div>
    </div>
  );
}
