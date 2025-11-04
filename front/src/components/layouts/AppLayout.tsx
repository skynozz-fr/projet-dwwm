import { Outlet } from "react-router-dom"
import { ThemeToggle } from "../ThemeToggle"
import { Navbar } from "../Navbar"
import { ScrollToTop } from "../ScrollToTop"

export const AppLayout = () => {
  return (
    <div className="min-h-screen p-3">
      <ScrollToTop />
      <Navbar />
      <div className="flex items-center justify-end my-2">
        <ThemeToggle />
      </div>
      <Outlet />
    </div>
  )
}