import { redirect } from "react-router";
import { fetchGameHistory, fetchRanking } from "../controllers/gameController.js";
import { fetchMapData } from "../controllers/mapController.js";
import { getUser } from "../controllers/userController.js";

export async function requireUser() {
  const user = await getUser();

  if (!user) {
    throw redirect("/");
  }

  return user;
}

export async function appDataLoader() {
  const user = await requireUser();
  const mapData = await fetchMapData();

  return { user, mapData };
}

export async function gameHistoryLoader() {
  const user = await requireUser();
  const games = await fetchGameHistory();

  return { user, games };
}

export async function rankingLoader() {
  const user = await requireUser();
  const ranking = await fetchRanking();

  return { user, ranking };
}
