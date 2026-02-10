import { Outlet } from "react-router-dom"
import { ThemeToggle } from "../ThemeToggle"
import { Navbar } from "../Navbar"
import { ScrollToTop } from "../ScrollToTop"
import { Footer } from "../Footer"

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="app-container flex-1">
        <div className="mt-4 mb-6 flex justify-end">
          <ThemeToggle />
        </div>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
