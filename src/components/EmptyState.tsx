export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <div className="mb-3 text-slate-500">
        Gib einen Ort in Deutschland ein, um die Vorhersage zu sehen.
      </div>
      <div className="text-sm text-slate-500">
        Beispiele: "Sylt", "Kiel", "Fehmarn", "Husum", "Norderney", "Rügen",
        "St. Peter‑Ording"
      </div>
    </div>
  );
}
