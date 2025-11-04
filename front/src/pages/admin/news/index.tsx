import React, { useState, useMemo, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/useToast"
import { usePagination } from "@/hooks/usePagination"
import { Pagination } from "@/components/Pagination"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Select } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { ErrorPage } from "@/pages/errors/ErrorPage"
import { Loader } from "@/components/Loader"
import type { News } from "@/types/news"
import { filterItems, formatDate } from "@/lib/utils"
import { getAllNews, deleteNews } from "@/services/news.service"
import { getNewsColor, translateNewsCategory, categoryFilterOptions } from "@/lib/news-helpers"

export const NewsAdmin = () => {
  const [news, setNews] = useState<News[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { toast } = useToast()

  // Récupérer la catégorie depuis l'URL
  const selectedCategory = searchParams.get("category") || "all"

  // Fonction pour changer la catégorie et mettre à jour l'URL
  const handleCategoryChange = useCallback((category: string) => {
    const next = new URLSearchParams(searchParams)
    if (category === "all") {
      next.delete("category")
    } else {
      next.set("category", category)
    }
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  // Alerts state
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [addAlertOpen, setAddAlertOpen] = useState(false)

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // Utiliser la route spéciale si une catégorie est sélectionnée
      const category = selectedCategory !== "all" ? selectedCategory as News["category"] : undefined
      const data = await getAllNews(category)
      setNews(data)
    } catch (err) {
      console.error("Erreur lors du chargement des actualités:", err)
      setError("Impossible de charger les actualités")
    } finally {
      setLoading(false)
    }
  }, [selectedCategory])

  // Charger les actualités depuis l'API
  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  // Filtrage optimisé avec useMemo
  const filteredNews = useMemo(() => {
    return filterItems(
      news, 
      searchTerm, 
      ["title", "excerpt"]
    )
  }, [news, searchTerm])

  // Pagination (10 items par page)
  const {
    currentPage,
    totalPages,
    paginatedData,
    totalItems,
    goToPage,
    resetPagination
  } = usePagination<News>({ data: filteredNews, itemsPerPage: 10 })

  // Reset pagination when filters/search change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { resetPagination() }, [searchTerm, selectedCategory])

  const requestDelete = (id: number) => {
    setDeleteTargetId(id)
    setDeleteAlertOpen(true)
  }

  const confirmDelete = async () => {
    if (deleteTargetId !== null) {
      try {
        await deleteNews(deleteTargetId)
        setNews(prev => prev.filter(n => n.id !== deleteTargetId))
        toast.success("Actualité supprimée !", "L'actualité a bien été supprimée.")
      } catch (err) {
        console.error("Erreur lors de la suppression:", err)
        toast.error("Erreur", "Impossible de supprimer l'actualité.")
      }
    }
    setDeleteTargetId(null)
    setDeleteAlertOpen(false)
  }

  // État de chargement
  if (loading) {
    return <Loader message="Chargement des actualités..." />
  }

  // État d'erreur
  if (error) {
    return (
      <ErrorPage
        title="Erreur de chargement"
        message="Une erreur est survenue lors du chargement des actualités. Veuillez réessayer."
        onRetry={fetchNews}
        onGoBack={() => navigate('/admin')}
      />
    )
  }

  return (
  <div className="space-y-8 px-2 md:px-6 py-8 max-w-full mx-auto">
      {/* Header + bouton */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
        <h2 className="text-2xl font-bold text-foreground">Actualités</h2>
        <Button className="w-full sm:w-auto" onClick={() => setAddAlertOpen(true)}>
          Nouvelle Actualité
        </Button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4 md:items-end bg-muted/40 rounded-lg px-4 py-4 border border-border mb-4">
        <Input
          label=""
          placeholder="Rechercher une actualité..."
          value={searchTerm}
          onChange={setSearchTerm}
          className="flex-1"
        />
        <Select
          label=""
          options={categoryFilterOptions}
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="md:max-w-xs"
        />
      </div>

      {/* Liste des news */}
      <div className="grid gap-6">
        {paginatedData.map((newsItem) => (
          <Card 
            key={newsItem.id} 
            className="p-5 md:p-7 hover:shadow-lg transition-all cursor-pointer hover:border-primary"
            onClick={() => navigate(`/admin/news/edit/${newsItem.id}`)}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground truncate max-w-xs md:max-w-md">{newsItem.title}</h3>
                  <span className={`px-2 py-1 ${getNewsColor(newsItem.category)} text-xs rounded-full font-semibold`}>
                    {translateNewsCategory(newsItem.category)}
                  </span>
                </div>
                <p className="text-muted-foreground mb-2 line-clamp-2 pt-1 border-t border-border/50">{newsItem.excerpt}</p>
                <div className="text-xs text-muted-foreground">
                  Par {newsItem.author ? `${newsItem.author.firstname} ${newsItem.author.lastname}` : "Auteur inconnu"} • {formatDate(newsItem.created_at)}
                </div>
              </div>
              <div className="flex gap-2 md:ml-4 shrink-0">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/admin/news/edit/${newsItem.id}`)
                  }}
                >
                  Modifier
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    requestDelete(newsItem.id)
                  }}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={10}
            totalItems={totalItems}
            onPageChange={goToPage}
            itemName="news"
          />
        </div>
      )}

      {filteredNews.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-lg">
          Aucune news trouvée
        </div>
      )}

      {/* Delete confirmation */}
      <Alert
        title="Supprimer cette actualité ?"
        description="Cette action est irréversible. La suppression ne peut pas être annulée."
        confirmText="Supprimer"
        cancelText="Annuler"
        open={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        onConfirm={confirmDelete}
      />

      {/* Add confirmation */}
      <Alert
        title="Créer une nouvelle actualité ?"
        description="Vous allez être redirigé vers le formulaire de création."
        confirmText="Continuer"
        cancelText="Annuler"
        open={addAlertOpen}
        onOpenChange={setAddAlertOpen}
        onConfirm={() => navigate("/admin/news/create")}
      />
    </div>
  )
}