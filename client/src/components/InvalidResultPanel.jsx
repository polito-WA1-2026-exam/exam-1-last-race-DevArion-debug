export default function InvalidResultPanel({ gameResult, onBackToOverview }) {
  const message =
    gameResult?.reason === "Time expired" || gameResult?.reason === "Time limit exceeded"
      ? "Time expired. You scored 0 points."
      : gameResult?.reason
        ? `${gameResult.reason}. You scored 0 points.`
        : "The submitted network is invalid.";

  return (
    <div className="flex flex-col h-full justify-between py-4 animate-fade-in">
      <div className="space-y-4 my-auto text-center">
        <div className="inline-block px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs uppercase tracking-widest rounded-md mb-2">
          ⚠️ Routing Anomaly
        </div>

        <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
          {message}
        </p>

        <p className="text-4xl font-black text-white mt-4">
          {gameResult?.finalScore ?? 0} coins
        </p>
      </div>

      <button
        onClick={onBackToOverview}
        className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm tracking-wider uppercase rounded-xl border border-slate-700 transition-colors"
      >
        Return to System Overview
      </button>
    </div>
  );
}