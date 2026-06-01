import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import UserDAO from "./daos/userDAO.js";
import userService from "./services/userService.js";
import gameRouter from './routes/gameRouter.js';
import mapRouter from './routes/mapRouter.js'; 
import "./db.js";

const app = express();
const port = 3001;

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: "polito-secret-key-change-me", 
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
  try {
    const user = await UserService.verifyUserCredentials(email, password);
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

app.post("/api/sessions", passport.authenticate("local"), (req, res) => {
  res.status(201).json(req.user);
});

app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

app.delete("/api/sessions", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json(err);
    res.status(204).end();
  });
});

app.use("/api/games", gameRouter);
app.use("/api/map", mapRouter); 

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});