import { X } from "lucide-react";
import type { SelectedPlace } from "../types";

function WeatherChip({ label, onClick, onDelete }: { label: string; onClick: () => void; onDelete: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow ring-1 ring-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      <span className="truncate max-w-[10rem]">{label}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label={`Remove ${label} from recents`}
        className="p-0.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function RecentChips({
  recents,
  onPick,
  onDelete,
}: {
  recents: SelectedPlace[];
  onPick: (r: SelectedPlace) => void;
  onDelete: (name: string) => void;
}) {
  if (!recents.length) return null;
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
      <span className="text-slate-500">Recently searched:</span>
      {recents.map((r) => (
        <WeatherChip
          key={`${r.name}-${r.latitude}`}
          label={r.displayName || r.name}
          onClick={() => onPick(r)}
          onDelete={() => onDelete(r.name)}
        />
      ))}
    </div>
  );
}
