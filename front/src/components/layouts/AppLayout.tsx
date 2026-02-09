import { Outlet } from "react-router-dom"
import { ThemeToggle } from "../ThemeToggle"
import { Navbar } from "../Navbar"
import { ScrollToTop } from "../ScrollToTop"

export const AppLayout = () => {
  return (
    <div className="min-h-screen pb-8">
      <ScrollToTop />
      <Navbar />
      <main className="app-container">
        <div className="mt-4 mb-6 flex justify-end">
          <ThemeToggle />
        </div>
        <Outlet />
      </main>
    </div>
  )
}
