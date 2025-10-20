import { useState, useEffect } from "react"
import { useToast } from "@/hooks/useToast"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/Button"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import type { News } from "@/types/news"
import { RequiredInput } from "@/components/ui/required-input"

export const NewsForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = !!id
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    excerpt: "",
    content: "",
    date: new Date().toISOString().split('T')[0], // Date du jour par défaut
  })
  const [saveAlertOpen, setSaveAlertOpen] = useState(false)

  useEffect(() => {
    if (isEditing && id) {
      loadActualite(parseInt(id))
    }
  }, [id, isEditing])

  const loadActualite = async (actualiteId: number) => {
    setLoading(true)
    try {
      // Simulation - remplace par ton appel API
      const mockActualite: News = {
        id: actualiteId,
        title: "Victoire en finale de coupe !",
        date: "2025-07-10",
        author: "Équipe Communication",
        category: "Match",
        excerpt: "Une victoire historique 3-1 face aux Aigles Dorés.",
        content: "Quelle soirée magique ! Nos joueurs ont livré une performance exceptionnelle...",
      }
      
      setFormData({
        title: mockActualite.title,
        author: mockActualite.author,
        category: mockActualite.category,
        excerpt: mockActualite.excerpt,
        content: mockActualite.content,
        date: mockActualite.date,
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
      // Appel API réel ici
      toast.success(
        isEditing ? "Actualité modifiée !" : "Actualité créée !",
        isEditing ? "Les modifications ont été enregistrées." : "La nouvelle actualité a été créée."
      )
      navigate("/admin/news")
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde", "Impossible d'enregistrer l'actualité.")
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
      {/* Header moderne */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/admin/news")}> 
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {isEditing ? "Modifier l'actualité" : "Nouvelle actualité"}
          </h1>
        </div>
      </div>

      <Card className="p-5 md:p-7 border border-border bg-background/80 shadow-sm">
        <form id="form-actualite" onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RequiredInput
              label="Titre"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Titre de l'actualité"
            />

            <RequiredInput
              label="Auteur"
              value={formData.author}
              onChange={(e) => handleInputChange("author", e.target.value)}
              placeholder="Nom de l'auteur"
            />

            <Select
              label="Catégorie"
              options={[
                { value: "Match", label: "Match" },
                { value: "Transfert", label: "Transfert" },
                { value: "Entraînement", label: "Entraînement" },
                { value: "Club", label: "Club" },
                { value: "Annonce", label: "Annonce" }
              ]}
              value={formData.category}
              onChange={(value) => handleInputChange("category", value)}
              required
            />

            <RequiredInput
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
            />
          </div>

          <Textarea
            label="Résumé"
            value={formData.excerpt}
            onChange={(value) => handleInputChange("excerpt", value)}
            placeholder="Résumé court de l'actualité"
            rows={3}
            required
          />

          <Textarea
            label="Contenu"
            value={formData.content}
            onChange={(value) => handleInputChange("content", value)}
            placeholder="Contenu complet de l'actualité"
            rows={8}
            required
          />
        </form>
      </Card>

      {/* Boutons sous la card, alignés à droite */}
      <div className="flex justify-end gap-4">
        <Button type="submit" form="form-actualite" disabled={loading}>
          {loading ? "Sauvegarde..." : isEditing ? "Mettre à jour" : "Créer"}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => navigate("/admin/news")}
        >
          Annuler
        </Button>
      </div>

      {/* Save confirmation */}
      <Alert
        title={isEditing ? "Mettre à jour cette actualité ?" : "Créer cette actualité ?"}
        description={isEditing ? "Les modifications seront enregistrées." : "Une nouvelle actualité sera créée."}
        confirmText={isEditing ? "Mettre à jour" : "Créer"}
        cancelText="Annuler"
        open={saveAlertOpen}
        onOpenChange={setSaveAlertOpen}
        onConfirm={confirmSave}
      />
    </div>
  )
}
