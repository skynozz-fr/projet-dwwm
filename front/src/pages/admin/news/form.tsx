import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import { Button } from "@/components/Button"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { ErrorPage } from "@/pages/errors/ErrorPage"
import { Loader } from "@/components/Loader"
import { RequiredInput } from "@/components/ui/required-input"

import { useToast } from "@/hooks/useToast"
import { categoryOptions } from "@/lib/news-helpers"
import { getNewsById, createNews, updateNews } from "@/services/news.service"

import { ArrowLeft } from "lucide-react"
import type { NewsCategory, News as NewsType, NewsPayload } from "@/types/news"

export const NewsForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = !!id
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    title: "",
    category: "" as NewsCategory | "",
    excerpt: "",
    content: "",
  })
  const [saveAlertOpen, setSaveAlertOpen] = useState(false)

  const {
    data: existingNews,
    isPending: isFetching,
    isError,
    refetch,
  } = useQuery<NewsType>({
    queryKey: ["news", id],
    queryFn: () => getNewsById(id as string),
    enabled: isEditing && !!id,
  })

  useEffect(() => {
    if (existingNews) {
      setFormData({
        title: existingNews.title,
        category: existingNews.category,
        excerpt: existingNews.excerpt,
        content: existingNews.content,
      })
    }
  }, [existingNews])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveAlertOpen(true)
  }

  const { mutate: createMutation, isPending: isCreating } = useMutation<NewsType, AxiosError<{ error?: string }>, NewsPayload>({
    mutationKey: ["news", "create"],
    mutationFn: (payload: NewsPayload) => createNews(payload),
    onSuccess: () => {
      toast.success("Actualité créée !", "La nouvelle actualité a été créée.")
      queryClient.invalidateQueries({ queryKey: ["news"] })
      navigate("/admin/news")
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Impossible d'enregistrer l'actualité."
      toast.error("Erreur lors de la sauvegarde", message)
    },
  })

  const { mutate: updateMutation, isPending: isUpdating } = useMutation<NewsType, AxiosError<{ error?: string }>, { id: string; payload: NewsPayload }>({
    mutationKey: ["news", "update"],
    mutationFn: ({ id, payload }: { id: string; payload: NewsPayload }) => updateNews(id, payload),
    onSuccess: () => {
      toast.success("Actualité modifiée !", "Les modifications ont été enregistrées.")
      queryClient.invalidateQueries({ queryKey: ["news"] })
      queryClient.invalidateQueries({ queryKey: ["news", id] })
      navigate("/admin/news")
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Impossible d'enregistrer l'actualité."
      toast.error("Erreur lors de la sauvegarde", message)
    },
  })

  const confirmSave = () => {
    if (!formData.category || !formData.title || !formData.excerpt || !formData.content) {
      toast.error("Champs requis", "Merci de remplir toutes les informations obligatoires")
      return
    }

    const payload: NewsPayload = {
      title: formData.title,
      category: formData.category as NewsCategory,
      excerpt: formData.excerpt,
      content: formData.content,
    }

    if (isEditing && id) updateMutation({ id, payload })
    else createMutation(payload)

    setSaveAlertOpen(false)
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isFetching && isEditing) return <Loader message="Chargement de l'actualité..." />

  if (isError && isEditing) {
    return (
      <ErrorPage
        title="Erreur de chargement"
        message="Impossible de charger l'actualité"
        onRetry={() => refetch()}
        onGoBack={() => navigate("/admin/news")}
      />
    )
  }

  return (
    <div className="space-y-8 px-2 md:px-6 py-8 max-w-full mx-auto">
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

      <div className="flex justify-end gap-4">
        <Button
          type="submit"
          form="form-actualite"
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? "Sauvegarde..." : isEditing ? "Mettre à jour" : "Créer"}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => navigate("/admin/news")}
        >
          Annuler
        </Button>
      </div>

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
