import { getSegmentLabel } from "../utils/gameHelpers.js";

export default function PlanningPanel({
  activeMoves,
  lines,
  stations,
  visitedSegments,
  onSelectSegment,
  onSubmitRoute
}) {
  return (
    <>
      <div className="p-4 bg-[#14223d] rounded-xl border border-cyan-500/30">
        <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
          Memory Recall Sequence
        </h3>

        <p className="text-xl font-black text-white mt-1">
          {visitedSegments.length} Segments Selected
        </p>

        <p className="text-xs font-mono text-slate-400 mt-2">
          Total available pool: {activeMoves.length} vector links
        </p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <h3 className="text-xs font-semibold text-slate-400 mb-3 tracking-wider uppercase">
          Network Infrastructure Directory
        </h3>

        {activeMoves.length === 0 ? (
          <p className="text-xs italic text-slate-500">
            No network links cataloged.
          </p>
        ) : (
          <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-[320px]">
            {activeMoves.map((seg) => {
              const matchedLine = lines.find(l => l.id === seg.line_id);
              const isAlreadySelected = visitedSegments.includes(seg.id);

              return (
                <div
                  key={seg.id}
                  className={`p-3 border rounded-lg flex items-center justify-between transition-colors ${
                    isAlreadySelected
                      ? "bg-slate-900/40 border-slate-800 opacity-40"
                      : "bg-[#111a2e] border-[#1e2a4a] hover:border-cyan-500/30"
                  }`}
                >
                  <div>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border"
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

                    <p className="text-sm font-bold text-white mt-2">
                      {getSegmentLabel(stations, seg)}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectSegment(seg)}
                    disabled={isAlreadySelected}
                    className={`px-3 py-1.5 font-bold text-xs rounded border transition-all ${
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

      <div className="pt-2">
        <button
          onClick={onSubmitRoute}
          disabled={visitedSegments.length === 0}
          className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl shadow-lg transition-all transform active:scale-95"
        >
          SUBMIT ROUTE CONFIG
        </button>
      </div>
    </>
  );
}