import classNames from "../utils/classNames";

export default function UnitToggle({
  unit,
  setUnit,
}: {
  unit: "C" | "F";
  setUnit: (u: "C" | "F") => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-xl bg-white shadow-sm ring-1 ring-slate-200 p-1">
      <button
        onClick={() => setUnit("C")}
        className={classNames(
          "px-2 py-1 rounded-lg text-sm",
          unit === "C" ? "bg-indigo-600 text-white" : "hover:bg-slate-100"
        )}
        aria-pressed={unit === "C"}
      >
        °C
      </button>
      <button
        onClick={() => setUnit("F")}
        className={classNames(
          "px-2 py-1 rounded-lg text-sm",
          unit === "F" ? "bg-indigo-600 text-white" : "hover:bg-slate-100"
        )}
        aria-pressed={unit === "F"}
      >
        °F
      </button>
    </div>
  );
}
