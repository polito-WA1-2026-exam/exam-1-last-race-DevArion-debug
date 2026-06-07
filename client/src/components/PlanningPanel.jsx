import { getSegmentLabel } from "../utils/gameHelpers.js";

export default function PlanningPanel({
  activeMoves,
  lines,
  stations,
  visitedSegments,
  submittingRoute,
  errorMessage,
  onSelectSegment,
  onSubmitRoute
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="bg-[#14223d] rounded-lg border border-cyan-500/30 px-3 py-2 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
            Route Assembly
          </h3>

          <p className="text-sm font-black text-white mt-0.5">
            {visitedSegments.length} of {activeMoves.length} segments selected
          </p>
        </div>

        <p className="text-[11px] font-mono text-slate-400 text-right">
          Select links in travel order
        </p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <h3 className="text-[11px] font-semibold text-slate-400 mb-2 tracking-wider uppercase">
          Network Infrastructure Directory
        </h3>

        {activeMoves.length === 0 ? (
          <p className="text-xs italic text-slate-500">
            No network links cataloged.
          </p>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-1.5">
            {activeMoves.map((seg) => {
              const matchedLine = lines.find(l => l.id === seg.line_id);
              const isAlreadySelected = visitedSegments.includes(seg.id);

              return (
                <div
                  key={seg.id}
                  className={`p-2 border rounded-lg grid grid-cols-[100px_1fr_96px] items-center gap-3 transition-colors ${
                    isAlreadySelected
                      ? "bg-slate-900/40 border-slate-800 opacity-40"
                      : "bg-[#111a2e] border-[#1e2a4a] hover:border-cyan-500/30"
                  }`}
                >
                  <span
                    className="text-[10px] px-1.5 py-1 rounded font-mono font-bold border truncate text-center"
                    style={{
                      backgroundColor: isAlreadySelected
                        ? "#1e293b20"
                        : `${matchedLine?.color}20`,
                      borderColor: isAlreadySelected
                        ? "#334155"
                        : matchedLine?.color,
                      color: isAlreadySelected
                        ? "#64748b"
                        : matchedLine?.color
                    }}
                  >
                    {matchedLine?.name ?? "Unknown Line"}
                  </span>

                  <p className="text-sm font-bold text-white leading-snug truncate">
                    {getSegmentLabel(stations, seg)}
                  </p>

                  <button
                    onClick={() => onSelectSegment(seg)}
                    disabled={isAlreadySelected}
                    className={`px-2.5 py-1.5 font-bold text-[11px] rounded border transition-all ${
                      isAlreadySelected
                        ? "bg-transparent text-slate-500 border-slate-800 cursor-not-allowed"
                        : "bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white border-cyan-500/30"
                    }`}
                  >
                    {isAlreadySelected ? "Selected" : "Select Link"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-[#1e2a4a] pt-3">
        {errorMessage && (
          <p className="text-sm text-rose-300 mb-3 bg-rose-950/40 border border-rose-500/30 rounded-lg px-3 py-2">
            {errorMessage}
          </p>
        )}

        <button
          onClick={() => onSubmitRoute()}
          disabled={submittingRoute || visitedSegments.length === 0}
          className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl shadow-lg transition-all transform active:scale-95"
        >
          {submittingRoute ? "SUBMITTING ROUTE..." : "SUBMIT ROUTE CONFIG"}
        </button>
      </div>
    </div>
  );
}