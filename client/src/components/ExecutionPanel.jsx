import { getExecutionSegmentLabel } from "../utils/gameHelpers.js";

export default function ExecutionPanel({
  stations,
  gameResult,
  currentExecutionStep,
  executionStepIndex,
  onNextStep
}) {
  if (!currentExecutionStep) return null;

  const isLastStep =
    executionStepIndex + 1 >= gameResult.executionSteps.length;

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="p-5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-4">
        <div>
          <h3 className="text-xl font-black text-emerald-400">
            Execution Phase
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Step {executionStepIndex + 1} of {gameResult.executionSteps.length}
          </p>
        </div>

        <div className="p-4 bg-[#111a2e] border border-[#1e2a4a] rounded-xl">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Segment
          </p>

          <p className="text-lg font-bold text-white mt-2">
            {getExecutionSegmentLabel(stations, currentExecutionStep)}
          </p>
        </div>

        <div className="p-4 bg-[#111a2e] border border-[#1e2a4a] rounded-xl">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Unexpected Event
          </p>

          <p className="text-lg font-bold text-white mt-2">
            {currentExecutionStep.eventDescription}
          </p>
        </div>

        <div className="p-4 bg-[#1a1612] rounded-xl border border-amber-500/20">
          <p className="text-xs uppercase font-bold text-amber-500 tracking-wider">
            Coin Change
          </p>

          <p className="text-2xl font-black text-white mt-2">
            {currentExecutionStep.coinChange > 0 ? "+" : ""}
            {currentExecutionStep.coinChange}
          </p>

          <p className="text-sm text-slate-400 mt-2">
            Updated total:
          </p>

          <p className="text-3xl font-black text-amber-400">
            {Math.max(0, currentExecutionStep.runningTotal ?? 0)}
          </p>
        </div>

        <button
          onClick={onNextStep}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-lg"
        >
          {isLastStep ? "Show Final Result" : "Next Step"}
        </button>
      </div>
    </div>
  );
}