import { createBrowserRouter } from "react-router";
import ReviewWrite from "./ReviewWrite";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: ReviewWrite,
  },
], { basename: "/review-write" });
