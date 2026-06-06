export default function SetupPanel({ loadingChallenge, onStartChallenge }) {
  return (
    <div className="flex flex-col h-full justify-between py-4">
      <div className="space-y-5">
        <div className="inline-block px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-widest rounded-md">
          Phase 1: Studying the map
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight">
          Transit Network Overview
        </h2>

        <p className="text-sm text-slate-400 leading-relaxed">
          Study the layout configurations carefully. Analyze your paths and track vectors to calculate an unbroken path matrix before initiating.
        </p>
      </div>

      <button
        onClick={onStartChallenge}
        disabled={loadingChallenge}
        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-black text-sm tracking-wider uppercase rounded-xl shadow-lg shadow-cyan-500/10 transition-all transform active:scale-[0.98]"
      >
        {loadingChallenge ? "SECURED LINKING..." : "START THE GAME"}
      </button>
    </div>
  );
}