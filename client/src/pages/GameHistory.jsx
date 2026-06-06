import { useLoaderData } from "react-router";
import { fetchGameHistory } from "../controllers/gameController.js"
import { getUser } from "../controllers/userController";
import Navbar from "../components/Navbar.jsx";

export async function gameHistoryLoader() {
  const [user, games] = await Promise.all([
    getUser(),
    fetchGameHistory()
  ]);

  return { user, games };
}
export default function GameHistory() {
  const { games } = useLoaderData();

  const bestScore = games.length > 0 ? games[0].score : 0;
  const totalGames = games.length;

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-100">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-black mt-4">
            My Game History
          </h1>

          <p className="text-sm text-slate-400 mt-2">
            Your completed games ordered by score.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-[#0b121f] border border-[#1e2a4a]">
            <p className="text-xs uppercase text-slate-400 font-bold tracking-wider">
              Best Score
            </p>
            <p className="text-3xl font-black text-amber-400 mt-2">
              {bestScore}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0b121f] border border-[#1e2a4a]">
            <p className="text-xs uppercase text-slate-400 font-bold tracking-wider">
              Games Played
            </p>
            <p className="text-3xl font-black text-white mt-2">
              {totalGames}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-[#0b121f] border border-[#1e2a4a] overflow-hidden">
          <div className="grid grid-cols-[80px_1fr] px-5 py-3 border-b border-[#1e2a4a] text-xs uppercase tracking-wider text-slate-400 font-bold">
            <span>Rank</span>
            <span>Score</span>
          </div>

          {games.length === 0 ? (
            <div className="p-6 text-sm text-slate-400">
              You have not played any games yet.
            </div>
          ) : (
            games.map((game, index) => (
              <div
                key={game.id}
                className="grid grid-cols-[80px_1fr] px-5 py-4 border-b border-[#1e2a4a] last:border-b-0"
              >
                <span className="font-mono text-slate-400">
                  #{index + 1}
                </span>

                <span className="font-black text-white">
                  {game.score} coins
                </span>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}