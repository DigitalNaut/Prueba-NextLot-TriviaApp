import createError from "http-errors";
import express, { Router } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";

import indexRouter from "./routes/index";

import favicon from "serve-favicon";

dotenv.config({ path: ".env" });

const app = express();
app.use(favicon(path.join(__dirname, "../public/images/favicon.ico")));

// View engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "jade");

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../trivia-app-client-vite/dist/")));

// Entry poitns
app.use("/", cors(), indexRouter);

app.get("/app*", (req:Request, res:Response, next:NextFunction) => {
  res.sendFile(path.join(__dirname, "../trivia-app-client-vite/dist/index.html"));
});

// Catch 404 and forward to error handler
app.use((req: unknown, res: unknown, next: (error: unknown) => void) =>
  next(createError(404))
);

interface Error {
  status?: number;
  message?: string;
}

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
