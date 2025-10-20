import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { RequiredInput } from "@/components/ui/required-input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import type { Match } from "@/types/match"
import { useToast } from "@/hooks/useToast"

export const MatchForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = !!id
  const [loading, setLoading] = useState(false)
  const [saveAlertOpen, setSaveAlertOpen] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    homeTeam: "",
    awayTeam: "",
    date: "",
    time: "",
    venue: "",
    location: "",
    competition: "",
    status: "À venir",
    homeScore: "",
    awayScore: "",
    description: "",
    homeFormation: "",
    awayFormation: "",
    referee: "",
    weather: "",
  })

  useEffect(() => {
    if (isEditing && id) {
      loadMatch(parseInt(id))
    }
  }, [id, isEditing])

  const loadMatch = async (matchId: number) => {
    setLoading(true)
    try {
      const mockMatch: Match = {
        id: matchId,
        homeTeam: "FC Local",
        awayTeam: "AS Visiteur",
        date: "2025-07-15",
        time: "15:00",
        venue: "Stade Municipal",
        location: "Ville, France",
        competition: "Championnat",
        status: "À venir",
        homeScore: null,
        awayScore: null,
        description: "Match important du championnat",
        homeFormation: "4-4-2",
        awayFormation: "4-3-3",
        referee: "M. Arbitre",
        weather: "Ensoleillé",
      }

      setFormData({
        homeTeam: mockMatch.homeTeam,
        awayTeam: mockMatch.awayTeam,
        date: mockMatch.date,
        time: mockMatch.time,
        venue: mockMatch.venue,
        location: mockMatch.location,
        competition: mockMatch.competition,
        status: mockMatch.status,
        homeScore: mockMatch.homeScore?.toString() || "",
        awayScore: mockMatch.awayScore?.toString() || "",
        description: mockMatch.description,
        homeFormation: mockMatch.homeFormation,
        awayFormation: mockMatch.awayFormation,
        referee: mockMatch.referee,
        weather: mockMatch.weather,
      })
    } catch (error) {
      console.error("Erreur lors du chargement:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveAlertOpen(true)
  }

  const confirmSave = async () => {
    setLoading(true)
    try {
      console.log("Données à sauvegarder:", formData)
      toast.success(
        isEditing ? "Match modifié !" : "Match créé !",
        isEditing ? "Les modifications ont été enregistrées." : "Le nouveau match a été créé."
      )
      navigate("/admin/matchs")
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde", "Impossible d'enregistrer le match.")
      console.error("Erreur lors de la sauvegarde:", error)
    } finally {
      setLoading(false)
      setSaveAlertOpen(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 px-2 md:px-6 py-8 max-w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/admin/matchs")}> 
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {isEditing ? "Modifier le match" : "Nouveau match"}
          </h1>
        </div>
      </div>

      <Card className="p-5 md:p-7 border border-border bg-background/80 shadow-sm">
        <form id="form-match" onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations du match</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <RequiredInput
                label="Équipe domicile"
                placeholder="Nom de l'équipe domicile"
                value={formData.homeTeam}
                onChange={(e) => handleInputChange("homeTeam", e.target.value)}
              />

              <RequiredInput
                label="Équipe visiteur"
                placeholder="Nom de l'équipe visiteur"
                value={formData.awayTeam}
                onChange={(e) => handleInputChange("awayTeam", e.target.value)}
              />

              <RequiredInput
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />

              <RequiredInput
                label="Heure"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
              />

              <RequiredInput
                label="Lieu"
                placeholder="Nom du stade"
                value={formData.venue}
                onChange={(e) => handleInputChange("venue", e.target.value)}
              />

              <RequiredInput
                label="Localisation"
                placeholder="Ville, Pays"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />

              <Select
                label="Compétition"
                value={formData.competition}
                onChange={(value) => handleInputChange("competition", value)}
                placeholder="Sélectionner une compétition"
                required
                options={[
                  { value: "Championnat", label: "Championnat" },
                  { value: "Coupe", label: "Coupe" },
                  { value: "Amical", label: "Match amical" },
                  { value: "Tournoi", label: "Tournoi" },
                ]}
              />

              <Select
                label="Statut"
                value={formData.status}
                onChange={(value) => handleInputChange("status", value)}
                required
                options={[
                  { value: "À venir", label: "À venir" },
                  { value: "En cours", label: "En cours" },
                  { value: "Terminé", label: "Terminé" },
                  { value: "Annulé", label: "Annulé" },
                  { value: "Reporté", label: "Reporté" },
                ]}
              />
            </div>
          </div>

          {formData.status === "Terminé" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Score final</h3>
              <div className="grid grid-cols-2 gap-6 max-w-md">
                <Input
                  label="Score domicile"
                  type="number"
                  value={formData.homeScore}
                  onChange={(value) => handleInputChange("homeScore", value)}
                  placeholder="0"
                />

                <Input
                  label="Score visiteur"
                  type="number"
                  value={formData.awayScore}
                  onChange={(value) => handleInputChange("awayScore", value)}
                  placeholder="0"
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Détails supplémentaires</h3>

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
              placeholder="Description du match"
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Arbitre"
                value={formData.referee}
                onChange={(value) => handleInputChange("referee", value)}
                placeholder="Nom de l'arbitre"
              />

              <Select
                label="Météo"
                value={formData.weather}
                onChange={(value) => handleInputChange("weather", value)}
                placeholder="Sélectionner"
                options={[
                  { value: "Ensoleillé", label: "Ensoleillé" },
                  { value: "Nuageux", label: "Nuageux" },
                  { value: "Pluvieux", label: "Pluvieux" },
                  { value: "Orageux", label: "Orageux" },
                  { value: "Neigeux", label: "Neigeux" },
                ]}
              />
            </div>
          </div>
        </form>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" form="form-match" disabled={loading}>
          {loading ? "Sauvegarde..." : isEditing ? "Mettre à jour" : "Créer"}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => navigate("/admin/matchs")}
        >
          Annuler
        </Button>
      </div>

      <Alert
        title={isEditing ? "Mettre à jour ce match ?" : "Créer ce match ?"}
        description={isEditing ? "Les modifications seront enregistrées." : "Un nouveau match sera créé."}
        confirmText={isEditing ? "Mettre à jour" : "Créer"}
        cancelText="Annuler"
        open={saveAlertOpen}
        onOpenChange={setSaveAlertOpen}
        onConfirm={confirmSave}
      />
    </div>
  )
}
