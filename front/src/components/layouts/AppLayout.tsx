import { Outlet } from "react-router-dom"
import { ThemeToggle } from "../ThemeToggle"
import { Navbar } from "../Navbar"
import { ToastContainer } from "../ui/toast"

export const AppLayout = () => {
  return (
    <div className="min-h-screen p-3">
      <Navbar />
      <div className="flex items-center justify-end my-2">
        <ThemeToggle />
      </div>
      <Outlet />
      <ToastContainer />
    </div>
  )
}