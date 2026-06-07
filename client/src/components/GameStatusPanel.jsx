export default function GameStatusPanel({
  coins,
  phase,
  timeLeft,
  startStation,
  destinationStation,
  onAbort
}) {
  return (
    <>
      <div className="p-3 bg-[#1a1612] rounded-lg border border-amber-500/20 flex items-center justify-between shadow-inner">
        <div>
          <h3 className="text-xs uppercase font-bold text-amber-500 tracking-wider">
            Your Coins
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 shadow-md">
          <span className="text-xl font-black text-amber-400 tracking-tight">
            {coins}
          </span>
        </div>
      </div>

      <div className="p-3 bg-[#111a2e] rounded-lg border border-[#1e2a4a] flex justify-between items-center gap-4">
        <div className="min-w-0">
          {phase === "planning" && (
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-xs uppercase font-bold text-rose-400 tracking-wider">
                Time Left
              </h3>

              <p className="text-lg font-black text-white">
                {timeLeft}s
              </p>
            </div>
          )}

          <h2 className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
            Mission Target
          </h2>

          <p className="text-sm text-slate-300 mt-1 truncate">
            Connect{" "}
            <span className="text-cyan-400 font-bold">
              {startStation?.name}
            </span>{" "}
            to{" "}
            <span className="text-rose-400 font-bold">
              {destinationStation?.name}
            </span>
          </p>
        </div>

        <button
          onClick={onAbort}
          className="text-[11px] px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 font-medium rounded text-slate-400 hover:text-white border border-slate-700 transition-colors"
        >
          Abort
        </button>
      </div>
    </>
  );
}