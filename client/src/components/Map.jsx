import React from 'react';

export default function Map({
  showLines = true,
  stations = [],
  segments = [],
  lines = [],
  visitedSegments = [],
  startStation,
  destinationStation,
  isGameStarted = false,
  onStationClick
}) {
  return (
    <div className="w-full h-full bg-[#0a1428] relative overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 700 550"
        className="network-map"
      >
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#131f36" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {showLines && segments.map((seg) => {
          const startPoint = stations.find(s => s.id === seg.start_station);
          const endPoint = stations.find(s => s.id === seg.end_station);

          if (!startPoint || !endPoint) return null;

          const matchedLine = lines.find(l => l.id === seg.line_id);

          return (
            <line
              key={`network-${seg.id}`}
              x1={startPoint.x}
              y1={startPoint.y}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke={matchedLine?.color ?? "#475569"}
              strokeWidth="6"
              strokeOpacity="0.45"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}

        {segments
          .filter(seg => visitedSegments.includes(seg.id))
          .map((seg) => {
            const startPoint = stations.find(s => s.id === seg.start_station);
            const endPoint = stations.find(s => s.id === seg.end_station);

            if (!startPoint || !endPoint) return null;

            const matchedLine = lines.find(l => l.id === seg.line_id);

            return (
              <line
                key={`visited-${seg.id}`}
                x1={startPoint.x}
                y1={startPoint.y}
                x2={endPoint.x}
                y2={endPoint.y}
                stroke={matchedLine?.color ?? "#22d3ee"}
                strokeWidth="8"
                strokeOpacity="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}

        {stations.map((station) => {
          const posX = Number(station.x);
          const posY = Number(station.y);

          if (isNaN(posX) || isNaN(posY)) {
            return null;
          }

          const isStart = station.id === startStation;
          const isDest = station.id === destinationStation;

          return (
            <g key={station.id}>
              {(isStart || isDest) && (
                <circle
                  cx={posX}
                  cy={posY}
                  r={isStart || isDest ? 24 : 18}
                  fill="none"
                  stroke={isStart ? "#22ff88" : isDest ? "#ff3366" : "#67e8f9"}
                  strokeWidth="5"
                />
              )}

              <circle
                cx={posX}
                cy={posY}
                r="13"
                fill="#0a1428"
                stroke={isStart ? "#22ff88" : isDest ? "#ff3366" : "#93c5fd"}
                strokeWidth={isStart || isDest ? "4" : "3"}
                onClick={() => onStationClick?.(station)}
              />

              <text
                x={posX}
                y={posY + 34}
                textAnchor="middle"
                fill="#e0e7ff"
                fontSize="12"
                fontWeight={isStart || isDest ? "700" : "500"}
                className="select-none pointer-events-none font-sans tracking-wide"
              >
                {station.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}