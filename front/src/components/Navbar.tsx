import { Logo } from "@/components/navbar-components/logo"
import UserMenu from "@/components/navbar-components/user-menu"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { navigationRoutes } from "@/routes"
import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"

export const Navbar = () => {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const filteredRoutes = navigationRoutes.filter((route) => {
    if (route.requiredRole) return user?.role === route.requiredRole
    return true
  })

  const isActiveRoute = (routePath: string) => {
    if (routePath === "/admin") return location.pathname.startsWith("/admin")
    return location.pathname === routePath
  }

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/90 backdrop-blur-md">
      <div className="app-container">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button className="group h-9 w-9 md:hidden" variant="outline" size="icon">
                  <svg className="pointer-events-none" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12L20 12" className="origin-center -translate-y-[7px] transition-all duration-300 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]" />
                    <path d="M4 12H20" className="origin-center transition-all duration-300 group-aria-expanded:rotate-45" />
                    <path d="M4 12H20" className="origin-center translate-y-[7px] transition-all duration-300 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]" />
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" sideOffset={10} className="w-52 rounded-lg border-border bg-surface p-2 md:hidden">
                <NavigationMenu className="max-w-none *:w-full">
                  <NavigationMenuList className="flex-col items-start gap-1">
                    {filteredRoutes.map((link, index) => (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink asChild className={`w-full rounded-md px-2 py-2 text-sm font-medium transition ${isActiveRoute(link.path) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"}`}>
                          <Link to={link.path} className="no-link-anim block w-full">
                            {link.label}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>

            <Link to="/home" className="no-link-anim hover:opacity-90">
              <Logo />
            </Link>

            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-1">
                {filteredRoutes.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      asChild
                      className={`relative rounded-md px-3 py-2 text-sm font-semibold transition ${isActiveRoute(link.path) ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <Link to={link.path} className="no-link-anim">
                        {link.label}
                        {isActiveRoute(link.path) && <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <UserMenu />
        </div>
      </div>
    </header>
  )
}
