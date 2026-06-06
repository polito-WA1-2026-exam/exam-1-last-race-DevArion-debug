export const INITIAL_COINS = 20;
export const PLANNING_TIME = 90;

export function getStationName(stations, stationId) {
  return stations.find(s => s.id === stationId)?.name ?? "???";
}

export function getSegmentLabel(stations, segment) {
  if (!segment) return "Unknown segment";

  return `${getStationName(stations, segment.start_station)} — ${getStationName(stations, segment.end_station)}`;
}

export function getExecutionSegmentLabel(stations, step) {
  if (!step) return "Unknown segment";

  return `${getStationName(stations, step.startStation)} — ${getStationName(stations, step.endStation)}`;
}