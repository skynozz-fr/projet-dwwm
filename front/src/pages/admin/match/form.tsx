import { useState, useEffect } from "react"

import { useParams, useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { ArrowLeft, Home, Plane } from "lucide-react"

import { Button } from "@/components/Button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/Input"
import { RequiredInput } from "@/components/ui/required-input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { RadioGroup, Radio } from "@/components/ui/radio-group"
import { ErrorPage } from "@/pages/errors/ErrorPage"
import { Loader } from "@/components/Loader"

import { useToast } from "@/hooks/useToast"

import { competitionOptions, statusOptions, weatherOptions } from "@/lib/match-helpers"

import { createMatch, getMatchById, updateMatch } from "@/services/match.service"

import type { Match, MatchCompetition, MatchStatus, MatchPayload } from "@/types/match"

export const MatchForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const isEditing = !!id
  const [saveAlertOpen, setSaveAlertOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    home_team: "",
    away_team: "",
    is_home: true,
    datetime: "",
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

  // Load match data in edit mode
  const {
    data: existingMatch,
    isPending: isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["match", id],
    queryFn: () => getMatchById(id as string),
    enabled: isEditing && !!id,
  })

  // Populate form when match data loads
  useEffect(() => {
    if (existingMatch) {
      // Convertir UTC vers heure locale pour input datetime-local
      const date = new Date(existingMatch.datetime)
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
      const datetimeLocal = date.toISOString().slice(0, 16)

      setFormData({
        home_team: existingMatch.home_team,
        away_team: existingMatch.away_team,
        is_home: existingMatch.is_home,
        datetime: datetimeLocal,
        venue: existingMatch.venue,
        location: existingMatch.location,
        competition: existingMatch.competition,
        status: existingMatch.status,
        home_score: existingMatch.home_score?.toString() || "",
        away_score: existingMatch.away_score?.toString() || "",
        description: existingMatch.description || "",
        referee: existingMatch.referee || "",
        weather: existingMatch.weather || "",
      })
    }
  }, [existingMatch])

  const { mutate: createMutation, isPending: isCreating } = useMutation<Match, AxiosError<{ error?: string }>, MatchPayload>({
    mutationKey: ["matches", "create"],
    mutationFn: (payload: MatchPayload) => createMatch(payload),
    onSuccess: () => {
      toast.success("Match créé !", "Le nouveau match a été créé.")
      queryClient.invalidateQueries({ queryKey: ["matches"] })
      navigate("/admin/matches")
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Impossible d'enregistrer le match."
      toast.error("Erreur lors de la sauvegarde", message)
    },
  })

  const { mutate: updateMutation, isPending: isUpdating } = useMutation<Match, AxiosError<{ error?: string }>, { id: string; payload: MatchPayload }>({
    mutationKey: ["matches", "update"],
    mutationFn: ({ id, payload }: { id: string; payload: MatchPayload }) => updateMatch(id, payload),
    onSuccess: () => {
      toast.success("Match modifié !", "Les modifications ont été enregistrées.")
      queryClient.invalidateQueries({ queryKey: ["matches"] })
      queryClient.invalidateQueries({ queryKey: ["match", id] })
      navigate("/admin/matches")
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Impossible d'enregistrer le match."
      toast.error("Erreur lors de la sauvegarde", message)
    },
  })

  const isSaving = isCreating || isUpdating

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveAlertOpen(true)
  }

  const confirmSave = () => {
    const homeTeam = formData.home_team.trim()
    const awayTeam = formData.away_team.trim()
    const venue = formData.venue.trim()
    const location = formData.location.trim()
    const description = formData.description.trim()
    const referee = formData.referee.trim()
    const weather = formData.weather.trim()

    if (!homeTeam || !awayTeam || !formData.datetime || !venue || !location || !formData.competition) {
      toast.error("Champs requis", "Merci de remplir toutes les informations obligatoires")
      setSaveAlertOpen(false)
      return
    }

    // Convertir datetime-local vers ISO UTC
    const datetimeISO = new Date(formData.datetime).toISOString()

    const payload: MatchPayload = {
      home_team: homeTeam,
      away_team: awayTeam,
      is_home: formData.is_home,
      datetime: datetimeISO,
      venue,
      location,
      competition: formData.competition as MatchCompetition,
      status: formData.status as MatchStatus,
      home_score: formData.home_score !== "" ? Number(formData.home_score) : null,
      away_score: formData.away_score !== "" ? Number(formData.away_score) : null,
      description: description || null,
      referee: referee || null,
      weather: weather || null,
    }

    if (isEditing && id) updateMutation({ id, payload })
    else createMutation(payload)
    
    setSaveAlertOpen(false)
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isFetching && isEditing) {
    return <Loader message="Chargement du match..." />
  }

  if (isError) {
    return (
      <ErrorPage
        title="Erreur de chargement"
        message="Impossible de charger le match"
        onRetry={() => refetch()}
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
                label="Date et heure"
                type="datetime-local"
                value={formData.datetime}
                onChange={(e) => handleInputChange("datetime", e.target.value)}
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
        <Button type="submit" form="form-match" disabled={isSaving}>
          {isSaving ? "Sauvegarde..." : isEditing ? "Mettre à jour" : "Créer"}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => navigate("/admin/matchs")}
          disabled={isSaving}
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