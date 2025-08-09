import { Button } from "@/components/Button"
import { useNavigate } from "react-router-dom"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { useState } from "react"

export const Calendar = () => {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())

  // Données des matchs étendues
  const matchsData = [
    {
      id: 1,
      homeTeam: "FC Popcorn",
      awayTeam: "AS Rivaux",
      date: "2025-07-15",
      time: "15h00",
      location: "Domicile",
      competition: "Championnat",
      competitionColor: "bg-primary text-primary-foreground"
    },
    {
      id: 2,
      homeTeam: "FC Popcorn",
      awayTeam: "FC Champions",
      date: "2025-07-22",
      time: "17h30",
      location: "Extérieur",
      competition: "Coupe",
      competitionColor: "bg-secondary text-secondary-foreground"
    },
    {
      id: 3,
      homeTeam: "FC Popcorn",
      awayTeam: "Étoiles FC",
      date: "2025-07-29",
      time: "14h00",
      location: "Domicile",
      competition: "Amical",
      competitionColor: "bg-tertiary text-tertiary-foreground"
    },
    {
      id: 4,
      homeTeam: "FC Popcorn",
      awayTeam: "United FC",
      date: "2025-08-05",
      time: "16h00",
      location: "Extérieur",
      competition: "Championnat",
      competitionColor: "bg-primary text-primary-foreground"
    },
    {
      id: 5,
      homeTeam: "FC Popcorn",
      awayTeam: "Racing Club",
      date: "2025-08-12",
      time: "15h30",
      location: "Domicile",
      competition: "Championnat",
      competitionColor: "bg-primary text-primary-foreground"
    },
    {
      id: 6,
      homeTeam: "Olympique FC",
      awayTeam: "FC Popcorn",
      date: "2025-08-19",
      time: "18h00",
      location: "Extérieur",
      competition: "Coupe",
      competitionColor: "bg-secondary text-secondary-foreground"
    }
  ]

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ]

  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

  // Fonctions utilitaires pour le calendrier
  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    return firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 // Ajuster pour commencer lundi
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getDaysInPrevMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate()
  }

  const getMatchesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return matchsData.filter(match => match.date === dateStr)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const renderCalendarDays = () => {
    const firstDay = getFirstDayOfMonth(currentDate)
    const daysInMonth = getDaysInMonth(currentDate)
    const daysInPrevMonth = getDaysInPrevMonth(currentDate)
    const today = new Date()
    
    const days = []

    // Jours du mois précédent
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i
      days.push(
        <div key={`prev-${day}`} className="min-h-[100px] p-2 text-muted-foreground bg-muted/20 border border-border">
          <div className="text-sm">{day}</div>
        </div>
      )
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const matches = getMatchesForDate(date)
      const isToday = date.toDateString() === today.toDateString()
      
      days.push(
        <div 
          key={day} 
          className={`min-h-[100px] p-2 border border-border hover:bg-muted/30 transition-colors ${
            isToday ? 'bg-primary/10 border-primary' : 'bg-background'
          }`}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : 'text-foreground'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {matches.map((match) => (
              <div
                key={match.id}
                className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${match.competitionColor}`}
                onClick={() => navigate(`/match/${match.id}`)}
              >
                <div className="font-medium truncate">
                  {match.homeTeam === "FC Popcorn" ? "vs" : "@"} {match.homeTeam === "FC Popcorn" ? match.awayTeam : match.homeTeam}
                </div>
                <div className="flex items-center text-xs opacity-90">
                  <Clock className="w-3 h-3 mr-1" />
                  {match.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    // Compléter avec les jours du mois suivant si nécessaire
    const totalCells = Math.ceil(days.length / 7) * 7
    const remainingCells = totalCells - days.length
    
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div key={`next-${day}`} className="min-h-[100px] p-2 text-muted-foreground bg-muted/20 border border-border">
          <div className="text-sm">{day}</div>
        </div>
      )
    }

    return days
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <CalendarIcon className="w-8 h-8 text-background mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-background">
              Calendrier des Matchs
            </h1>
          </div>
          <p className="text-xl text-background/90 max-w-2xl mx-auto">
            Découvrez tous les matchs du FC Popcorn directement dans le calendrier
          </p>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigateMonth('prev')}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Mois précédent
            </Button>
            
            <div className="flex items-center space-x-4">
              <h2 className="text-3xl font-bold text-foreground">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={goToToday}
              >
                Aujourd'hui
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => navigateMonth('next')}
              className="flex items-center"
            >
              Mois suivant
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background border border-border rounded-lg overflow-hidden shadow-lg">
            {/* Days Header */}
            <div className="grid grid-cols-7 bg-muted">
              {dayNames.map((day) => (
                <div key={day} className="p-4 text-center font-semibold text-foreground border-r border-border last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {renderCalendarDays()}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Légende</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-primary rounded mr-2"></div>
                <span className="text-foreground">Championnat</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-secondary rounded mr-2"></div>
                <span className="text-foreground">Coupe</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-tertiary rounded mr-2"></div>
                <span className="text-foreground">Amical</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-primary/10 border-2 border-primary rounded mr-2"></div>
                <span className="text-foreground">Aujourd'hui</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
