import { useState, useEffect } from "react"
import { useToast } from "@/hooks/useToast"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/Button"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { ErrorPage } from "@/pages/errors/ErrorPage"
import { Loader } from "@/components/Loader"
import { RequiredInput } from "@/components/ui/required-input"
import { getNewsById, createNews, updateNews } from "@/services/news.service"
import type { NewsCategory } from "@/types/news"
import { categoryOptions } from "@/lib/news-helpers"

export const NewsForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = !!id
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "" as NewsCategory | "",
    excerpt: "",
    content: "",
  })
  const [saveAlertOpen, setSaveAlertOpen] = useState(false)

  useEffect(() => {
    if (isEditing && id) {
      loadActualite(parseInt(id))
    }
  }, [id, isEditing])

  const loadActualite = async (actualiteId: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getNewsById(actualiteId)
      setFormData({
        title: data.title,
        category: data.category,
        excerpt: data.excerpt,
        content: data.content,
      })
    } catch (err: unknown) {
      console.error("Erreur lors du chargement:", err)
      type HttpErr = { response?: { status?: number } }
      const status = (err as HttpErr).response?.status
      if (status === 404) {
        setError("Actualité introuvable")
      } else {
        setError("Impossible de charger l'actualité")
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
      if (!formData.category || !formData.title || !formData.excerpt || !formData.content) {
        toast.error("Champs requis", "Merci de remplir toutes les informations obligatoires")
        return
      }

      const payload = {
        title: formData.title,
        category: formData.category as NewsCategory,
        excerpt: formData.excerpt,
        content: formData.content,
      }

      if (isEditing && id) {
        await updateNews(parseInt(id), payload)
        toast.success("Actualité modifiée !", "Les modifications ont été enregistrées.")
      } else {
        await createNews(payload)
        toast.success("Actualité créée !", "La nouvelle actualité a été créée.")
      }
      navigate("/admin/news")
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err)
      toast.error("Erreur lors de la sauvegarde", "Impossible d'enregistrer l'actualité.")
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
        onRetry={() => id && loadActualite(parseInt(id))}
        onGoBack={() => navigate("/admin/news")}
      />
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

            <Select
              label="Catégorie"
              options={categoryOptions}
              value={formData.category}
              onChange={(value) => handleInputChange("category", value)}
              required
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
