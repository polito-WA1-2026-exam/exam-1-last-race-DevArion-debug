import React, { useState } from 'react';

const stations = [
  { id: 1, name: "Centrale", x: 150, y: 200 },
  { id: 2, name: "Porta Velaria", x: 280, y: 120 },
  { id: 3, name: "Crocevia del Falco", x: 420, y: 180 },
  { id: 4, name: "Piazza delle Lanterne", x: 520, y: 280 },
  { id: 5, name: "Fontana Oscura", x: 280, y: 280 },
  { id: 6, name: "Borgo Sereno", x: 180, y: 380 },
  { id: 7, name: "Viale dei Mosaici", x: 520, y: 400 },
  { id: 8, name: "Torre Cinerea", x: 420, y: 320 },
  { id: 9, name: "Campo dell'Eco", x: 620, y: 220 },
  { id: 10, name: "Nivete", x: 80, y: 250 },
  { id: 11, name: "Caralisi", x: 350, y: 450 },
  { id: 12, name: "Pardineria", x: 480, y: 480 },
];

const lines = [
  { color: "#ff3b5c", points: [1, 2, 3, 4] },      
  { color: "#3b9eff", points: [1, 5, 6, 7] },      
  { color: "#39ff9e", points: [2, 5, 8, 9] },      
  { color: "#ffe53b", points: [4, 8, 7, 9] },      
];

export default function Map({ 
  showLines = true, 
  startStation, 
  destinationStation, 
  onStationClick 
}) {
  const [hoveredStation, setHoveredStation] = useState(null);

  return (
    <div className="w-full h-full bg-[#0a1428] rounded-2xl overflow-hidden border border-[#1e2a4a] shadow-2xl relative">
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 700 550" 
        className="network-map"
      >
        {/* Background Grid */}
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1a2333" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Draw Lines */}
        {showLines && lines.map((line, idx) => (
          <g key={idx}>
            {line.points.slice(0, -1).map((_, i) => {
              const start = stations.find(s => s.id === line.points[i]);
              const end = stations.find(s => s.id === line.points[i + 1]);
              return (
                <line
                  key={i}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={line.color}
                  strokeWidth="6"
                  strokeOpacity="0.85"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
          </g>
        ))}

        {/* Draw Stations */}
        {stations.map((station) => {
          const isStart = station.id === startStation;
          const isDest = station.id === destinationStation;
          const isHovered = hoveredStation === station.id;

          return (
            <g key={station.id}>
              {/* Glow Effect */}
              {(isStart || isDest || isHovered) && (
                <circle
                  cx={station.x}
                  cy={station.y}
                  r={isStart || isDest ? 24 : 18}
                  fill="none"
                  stroke={isStart ? "#22ff88" : isDest ? "#ff3366" : "#67e8f9"}
                  strokeWidth="5"
                  strokeOpacity="0.4"
                />
              )}

              {/* Station Circle */}
              <circle
                cx={station.x}
                cy={station.y}
                r="13"
                fill="#0a1428"
                stroke={isStart ? "#22ff88" : isDest ? "#ff3366" : "#93c5fd"}
                strokeWidth={isStart || isDest ? "4" : "3"}
                className="cursor-pointer transition-all hover:scale-110"
                onMouseEnter={() => setHoveredStation(station.id)}
                onMouseLeave={() => setHoveredStation(null)}
                onClick={() => onStationClick?.(station)}
              />

              {/* Station Name */}
              <text
                x={station.x}
                y={station.y + 38}
                textAnchor="middle"
                fill="#e0e7ff"
                fontSize="13"
                fontWeight={isStart || isDest ? "700" : "500"}
                className="select-none pointer-events-none"
              >
                {station.name}
              </text>

              {/* Start Label */}
              {isStart && (
                <text
                  x={station.x}
                  y={station.y - 38}
                  textAnchor="middle"
                  fill="#22ff88"
                  fontSize="12"
                  fontWeight="700"
                >
                  START
                </text>
              )}

              {/* Destination Label */}
              {isDest && (
                <text
                  x={station.x}
                  y={station.y - 38}
                  textAnchor="middle"
                  fill="#ff3366"
                  fontSize="12"
                  fontWeight="700"
                >
                  DESTINATION
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}