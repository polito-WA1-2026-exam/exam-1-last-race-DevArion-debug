export default function ValidResultPanel({ gameResult, onStartNewGame }) {
  return (
    <div className="flex flex-col h-full justify-between py-4 animate-fade-in">
      <div className="space-y-4 my-auto text-center">
        <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase tracking-widest rounded-md mb-2">
          Race Complete
        </div>

        <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
          Your route was valid and the journey is complete.
        </p>

        <p className="text-4xl font-black text-white mt-4">
          {Math.max(0, gameResult?.finalScore ?? 0)} coins
        </p>
      </div>

      <button
        onClick={onStartNewGame}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wider uppercase rounded-xl transition-colors"
      >
        Start New Game
      </button>
    </div>
  );
}