import { useLoaderData } from "react-router";
import Navbar from "../components/Navbar.jsx";

export default function Ranking() {
  const { ranking } = useLoaderData();

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-100">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-black mt-4">
            General Ranking
          </h1>

          <p className="text-sm text-slate-400 mt-2">
            Best score recorded for each registered player.
          </p>
        </div>

        <div className="rounded-xl bg-[#0b121f] border border-[#1e2a4a] overflow-hidden">
          <div className="grid grid-cols-[80px_1fr_150px_150px] px-5 py-3 border-b border-[#1e2a4a] text-xs uppercase tracking-wider text-slate-400 font-bold">
            <span>Rank</span>
            <span>Player</span>
            <span>Best Score</span>
            <span>Games</span>
          </div>

          {ranking.length === 0 ? (
            <div className="p-6 text-sm text-slate-400">
              No completed games have been recorded yet.
            </div>
          ) : (
            ranking.map((row, index) => (
              <div
                key={row.userId}
                className="grid grid-cols-[80px_1fr_150px_150px] px-5 py-4 border-b border-[#1e2a4a] last:border-b-0"
              >
                <span className="font-mono text-slate-400">
                  #{index + 1}
                </span>

                <span className="font-bold text-white">
                  {row.username}
                </span>

                <span className="font-black text-amber-400">
                  {row.bestScore} coins
                </span>

                <span className="text-slate-300">
                  {row.gamesPlayed}
                </span>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}