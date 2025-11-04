import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Home, Plane } from "lucide-react"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { RequiredInput } from "@/components/ui/required-input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { RadioGroup, Radio } from "@/components/ui/radio-group"
import type { MatchCompetition, MatchStatus } from "@/types/match"
import { useToast } from "@/hooks/useToast"
import { ErrorPage } from "@/pages/errors/ErrorPage"
import { Loader } from "@/components/Loader"
import { getMatchById, createMatch, updateMatch } from "@/services/match.service"
import { competitionOptions, statusOptions, weatherOptions } from "@/lib/match-helpers"
import { Label } from "@/components/ui/label"

export const MatchForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = !!id
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveAlertOpen, setSaveAlertOpen] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    home_team: "",
    away_team: "",
    is_home: true,
    date: "",
    time: "",
    venue: "",
    location: "",
    competition: "" as MatchCompetition | "",
    status: "SCHEDULED" as MatchStatus,
    home_score: "",
    away_score: "",
    description: "",
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
    setError(null)
    try {
      const data = await getMatchById(matchId)
      setFormData({
        home_team: data.home_team,
        away_team: data.away_team,
        is_home: data.is_home,
        date: data.date.split('T')[0], // Extraire seulement YYYY-MM-DD
        time: data.time,
        venue: data.venue,
        location: data.location,
        competition: data.competition,
        status: data.status,
        home_score: data.home_score?.toString() || "",
        away_score: data.away_score?.toString() || "",
        description: data.description || "",
        referee: data.referee || "",
        weather: data.weather || "",
      })
    } catch (err: unknown) {
      console.error("Erreur lors du chargement:", err)
      type HttpErr = { response?: { status?: number } }
      const status = (err as HttpErr).response?.status
      if (status === 404) {
        setError("Match introuvable")
      } else {
        setError("Impossible de charger le match")
      }
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
      if (!formData.home_team || !formData.away_team || !formData.date || !formData.time || !formData.venue || !formData.location || !formData.competition) {
        toast.error("Champs requis", "Merci de remplir toutes les informations obligatoires")
        return
      }

      const payload = {
        home_team: formData.home_team,
        away_team: formData.away_team,
        is_home: formData.is_home,
        date: formData.date,
        time: formData.time,
        venue: formData.venue,
        location: formData.location,
        competition: formData.competition as MatchCompetition,
        status: formData.status as MatchStatus,
        home_score: formData.home_score !== "" ? Number(formData.home_score) : null,
        away_score: formData.away_score !== "" ? Number(formData.away_score) : null,
        description: formData.description.trim() || null,
        referee: formData.referee.trim() || null,
        weather: formData.weather || null,
      }

      if (isEditing && id) {
        await updateMatch(parseInt(id), payload)
        toast.success("Match modifié !", "Les modifications ont été enregistrées.")
      } else {
        await createMatch(payload)
        toast.success("Match créé !", "Le nouveau match a été créé.")
      }
      navigate("/admin/matchs")
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde", "Impossible d'enregistrer le match.")
      console.error("Erreur lors de la sauvegarde:", error)
    } finally {
      setLoading(false)
      setSaveAlertOpen(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading && isEditing) {
    return <Loader />
  }

  if (error) {
    return (
      <ErrorPage
        title="Erreur de chargement"
        message={error}
        onRetry={() => id && loadMatch(parseInt(id))}
        onGoBack={() => navigate("/admin/matchs")}
      />
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
                value={formData.home_team}
                onChange={(e) => handleInputChange("home_team", e.target.value)}
              />

              <RequiredInput
                label="Équipe visiteur"
                placeholder="Nom de l'équipe visiteur"
                value={formData.away_team}
                onChange={(e) => handleInputChange("away_team", e.target.value)}
              />

              <div className="md:col-span-2">
                <Label className="mb-3 inline-block">
                  Lieu du match <span className="text-error">*</span>
                </Label>
                <RadioGroup
                  value={formData.is_home ? "home" : "away"}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, is_home: value === "home" }))}
                  className="flex-row gap-6"
                >
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <Radio value="home" />
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      <Home className="w-4 h-4" />
                      Domicile
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <Radio value="away" />
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      <Plane className="w-4 h-4" />
                      Extérieur
                    </span>
                  </label>
                </RadioGroup>
              </div>

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
                options={competitionOptions}
              />

              <Select
                label="Statut"
                value={formData.status}
                onChange={(value) => handleInputChange("status", value)}
                required
                options={statusOptions}
              />
            </div>
          </div>

          {formData.status === "COMPLETED" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Score final</h3>
              <div className="grid grid-cols-2 gap-6 max-w-md">
                <Input
                  label="Score domicile"
                  type="number"
                  value={formData.home_score}
                  onChange={(value) => handleInputChange("home_score", value)}
                  placeholder="0"
                  min="0"
                />

                <Input
                  label="Score visiteur"
                  type="number"
                  value={formData.away_score}
                  onChange={(value) => handleInputChange("away_score", value)}
                  placeholder="0"
                  min="0"
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
                options={weatherOptions}
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
