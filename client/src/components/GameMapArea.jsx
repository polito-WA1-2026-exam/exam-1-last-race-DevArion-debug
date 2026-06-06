import Map from "./Map.jsx";

export default function GameMapArea({
  phase,
  stations,
  segments,
  lines,
  visitedSegments,
  activeChallenge,
  isGameStarted,
  onUndo
}) {
  return (
    <div className="w-full h-full relative">
      <Map
        showLines={phase === "setup"}
        stations={stations}
        segments={segments}
        lines={lines}
        visitedSegments={visitedSegments}
        startStation={activeChallenge?.startStationId}
        destinationStation={activeChallenge?.endStationId}
        isGameStarted={isGameStarted}
        onStationClick={() => {}}
      />

      {phase === "planning" && visitedSegments.length > 0 && (
        <button
          onClick={onUndo}
          className="absolute top-4 right-4 z-50 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md border border-slate-600 transition flex items-center gap-2"
        >
          Undo Last Choice
        </button>
      )}
    </div>
  );
}