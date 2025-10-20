import { createBrowserRouter, Navigate } from "react-router-dom"

import { AppLayout } from "@/components/layouts/AppLayout"
import { AdminLayout } from "@/components/layouts/AdminLayout"

import {
  Login,
  Register,
  Home,
  Calendar,
  About,
  MatchDetail,
  NewsDetail,
  Unauthorized,
  NotFound,
} from "@/pages/"

import {
  AdminDashboard,
  NewsAdmin,
  NewsForm,
  MatchsAdmin,
  MatchForm,
  UsersAdmin,
} from "@/pages/admin/"

// Navigation routes used in the navbar
export const navigationRoutes = [
  { path: "/home", label: "Accueil" },
  { path: "/calendar", label: "Calendrier" },
  { path: "/about", label: "À propos" },
  { path: "/admin", label: "Administration" },
]

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="home" replace /> },

      { path: "home", element: <Home /> },
      { path: "calendar", element: <Calendar /> },
      { path: "about", element: <About /> },

      { path: "match/:id", element: <MatchDetail /> },
      { path: "news/:id", element: <NewsDetail /> },

      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "news", element: <NewsAdmin /> },
          { path: "news/create", element: <NewsForm /> },
          { path: "news/edit/:id", element: <NewsForm /> },
          { path: "matchs", element: <MatchsAdmin /> },
          { path: "match/create", element: <MatchForm /> },
          { path: "match/edit/:id", element: <MatchForm /> },
          { path: "users", element: <UsersAdmin /> },
        ],
      },

      { path: "unauthorized", element: <Unauthorized /> },
      { path: "*", element: <NotFound /> },
    ],
  },
])