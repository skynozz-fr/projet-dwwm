import { AppLayout } from "@/components/layouts/AppLayout"
import { About } from "@/pages/about"
import { Home } from "@/pages/home"
import { Login } from "@/pages/login"
import { Register } from "@/pages/register"
import { MatchDetail } from "@/pages/match-detail"
import { ActualiteDetail } from "@/pages/actualite-detail"
import { Calendar } from "@/pages/calendar"
import { Admin } from "@/pages/admin"
import { createBrowserRouter, Navigate } from "react-router-dom"

// Navigation routes that will be used in the navbar
export const navigationRoutes = [
  { path: "/home", label: "Accueil" },
  { path: "/calendar", label: "Calendrier" },
  { path: "/about", label: "À propos" },
]

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: <AppLayout />,
    children: [
      { path: "", element: <Home /> },
    ],
  },
  {
    path: "/calendar",
    element: <AppLayout />,
    children: [
      { path: "", element: <Calendar /> },
    ],
  },
  {
    path: "/about", 
    element: <AppLayout />,
    children: [
      { path: "", element: <About /> },
    ],
  },
  {
    path: "/match/:id",
    element: <AppLayout />,
    children: [
      { path: "", element: <MatchDetail /> },
    ],
  },
  {
    path: "/actualite/:id",
    element: <AppLayout />,
    children: [
      { path: "", element: <ActualiteDetail /> },
    ],
  },
  {
    path: "/admin",
    element: <AppLayout />,
    children: [
      { path: "", element: <Admin /> },
    ],
  },
])