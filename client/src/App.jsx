import { useCallback, useEffect, useState } from 'react';
import { useLoaderData } from "react-router";
import Navbar from "./components/Navbar";
import GameMapArea from './components/GameMapArea.jsx';
import { fetchChallenge, submitGameRoute } from "./controllers/gameController";
import { INITIAL_COINS, PLANNING_TIME } from "./utils/gameHelpers.js";
import SetupPanel from './components/SetupPanel.jsx';
import InvalidResultPanel from './components/InvalidResultPanel.jsx';
import ValidResultPanel from './components/ValidResultPanel.jsx';
import GameStatusPanel from './components/GameStatusPanel.jsx';
import PlanningPanel from './components/PlanningPanel.jsx';
import ExecutionPanel from './components/ExecutionPanel.jsx';

function App() {
  const { mapData } = useLoaderData();
  const stations = mapData?.stations ?? [];
  const segments = mapData?.segments ?? [];
  const lines = mapData?.lines ?? [];

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [loadingChallenge, setLoadingChallenge] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [visitedSegments, setVisitedSegments] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [coins, setCoins] = useState(INITIAL_COINS);
  const [phase, setPhase] = useState("setup");
  const [timeLeft, setTimeLeft] = useState(PLANNING_TIME);
  const [executionStepIndex, setExecutionStepIndex] = useState(0);
  const [submittingRoute, setSubmittingRoute] = useState(false);
  const [actionError, setActionError] = useState("");

  const startStation = stations.find(s => s.id === activeChallenge?.startStationId);
  const destinationStation = stations.find(s => s.id === activeChallenge?.endStationId);
  const activeMoves = segments;
  const currentExecutionStep = gameResult?.executionSteps?.[executionStepIndex];
  const displayedCoins =
    phase === "execution" && currentExecutionStep
      ? Math.max(0, currentExecutionStep.runningTotal ?? 0)
      : coins;

  const resetGameState = () => {
    setIsGameStarted(false);
    setActiveChallenge(null);
    setLoadingChallenge(false);
    setVisitedSegments([]);
    setGameResult(null);
    setCoins(INITIAL_COINS);
    setTimeLeft(PLANNING_TIME);
    setExecutionStepIndex(0);
    setSubmittingRoute(false);
    setActionError("");
    setPhase("setup");
  };

  const handleStartChallenge = async () => {
    try {
      setLoadingChallenge(true);
      setActionError("");
      setGameResult(null);
      setVisitedSegments([]);
      setCoins(INITIAL_COINS);
      setTimeLeft(PLANNING_TIME);
      setExecutionStepIndex(0);
      setSubmittingRoute(false);

      const challenge = await fetchChallenge();
      const startId = challenge.startStation?.id;
      const endId = challenge.endStation?.id;

      setActiveChallenge({
        startStationId: startId,
        endStationId: endId,
        startTime: challenge.startTime || challenge.start_time || Date.now()
      });

      setIsGameStarted(true);
      setPhase("planning");
    } catch (err) {
      console.error("Failed to spin up challenge:", err);
      setActionError(err.message || "Could not start a new challenge.");
    } finally {
      setLoadingChallenge(false);
    }
  };

  const handleTravel = (segment) => {
    if (visitedSegments.includes(segment.id)) return;

    setVisitedSegments(prev => [...prev, segment.id]);
  };

  const handleSubmitScore = useCallback(async () => {
    if (!activeChallenge || phase !== "planning" || submittingRoute) return;

    try {
      setSubmittingRoute(true);
      setActionError("");

      const payload = {
        routeSegmentIds: visitedSegments,
        startStationId: activeChallenge.startStationId,
        endStationId: activeChallenge.endStationId,
        startTime: activeChallenge.startTime
      };

      const result = await submitGameRoute(payload);
      setGameResult(result);

      if (result.isValid) {
        setExecutionStepIndex(0);
        setCoins(INITIAL_COINS);

        if ((result.executionSteps ?? []).length > 0) {
          setPhase("execution");
        } else {
          setPhase("result");
        }
      } else {
        setCoins(0);
        setPhase("result");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setActionError(err.message || "Could not submit the route.");
    } finally {
      setSubmittingRoute(false);
    }
  }, [activeChallenge, phase, submittingRoute, visitedSegments]);

  const handleNextExecutionStep = () => {
    if (!gameResult?.executionSteps) return;

    const isLastStep = executionStepIndex + 1 >= gameResult.executionSteps.length;

    if (isLastStep) {
      setCoins(Math.max(0, gameResult.finalScore ?? 0));
      setPhase("result");
      return;
    }

    setExecutionStepIndex(prev => prev + 1);
  };

  const handleUndo = () => {
    if (phase !== "planning") return;
    if (visitedSegments.length === 0) return;
    setVisitedSegments(prev => prev.slice(0, -1));
  };

  const handleBackToOverview = () => {
    resetGameState();
  };

  useEffect(() => {
    if (phase !== "planning") return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "planning") return;

    if (timeLeft === 0) {
      const submitTimer = setTimeout(() => {
        handleSubmitScore();
      }, 0);

      return () => clearTimeout(submitTimer);
    }
  }, [timeLeft, phase, handleSubmitScore]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#060b13] text-slate-100 overflow-hidden">
      <Navbar hideResultLinks={phase === "planning" || phase === "execution"} />
      <div className="grid grid-cols-[5fr_5fr] w-full h-[calc(100vh-4rem)]">
        <GameMapArea
          phase={phase}
          stations={stations}
          segments={segments}
          lines={lines}
          visitedSegments={visitedSegments}
          activeChallenge={activeChallenge}
          onUndo={handleUndo}
        />

        <div className="bg-[#0b121f] border-l border-[#1e2a4a] p-6 flex flex-col gap-5 overflow-y-auto">

          {!isGameStarted ? (
            <SetupPanel
              loadingChallenge={loadingChallenge}
              onStartChallenge={handleStartChallenge}
              errorMessage={actionError}
            />
          ) : phase === "result" && gameResult && !gameResult.isValid ? (
            <InvalidResultPanel
              gameResult={gameResult}
              onBackToOverview={handleBackToOverview}
            />
          ) : phase === "result" && gameResult?.isValid ? (
            <ValidResultPanel
              gameResult={gameResult}
              onStartNewGame={handleStartChallenge}
            />
          ) : (
            <div className="flex flex-col h-full gap-5">
              <GameStatusPanel
                coins={displayedCoins}
                phase={phase}
                timeLeft={timeLeft}
                startStation={startStation}
                destinationStation={destinationStation}
                onAbort={handleBackToOverview}
              />

              {phase === "planning" ? (
              <PlanningPanel
                activeMoves={activeMoves}
                lines={lines}
                stations={stations}
                visitedSegments={visitedSegments}
                submittingRoute={submittingRoute}
                errorMessage={actionError}
                onSelectSegment={handleTravel}
                onSubmitRoute={handleSubmitScore}
              />
              ) : phase === "execution" && currentExecutionStep ? (
                <ExecutionPanel
                  stations={stations}
                  gameResult={gameResult}
                  currentExecutionStep={currentExecutionStep}
                  executionStepIndex={executionStepIndex}
                  onNextStep={handleNextExecutionStep}
                />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
