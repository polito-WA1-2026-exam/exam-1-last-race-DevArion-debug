import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import UserDAO from "./daos/userDAO.js";
import userService from "./services/userService.js";
import gameRouter from './routes/gameRouter.js';
import mapRouter from './routes/mapRouter.js';
import authRouter from './routes/authRouter.js';
import "./db.js";

const app = express();
const port = 3001;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: "polito-key",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
  try {
    const user = await userService.verifyUserCredentials(email, password);
    if (!user) {
      return done(null, false, { message: "Incorrect email or password." });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserDAO.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use("/api/games", gameRouter);
app.use("/api/map", mapRouter);
app.use("/api/sessions", authRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});