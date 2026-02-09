import React, { useState, useMemo, useDeferredValue } from "react"

import { useNavigate } from "react-router-dom"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input"
import { Select } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { Pagination } from "@/components/Pagination"
import { ErrorPage } from "@/pages/errors/ErrorPage"
import { Loader } from "@/components/Loader"

import { useToast } from "@/hooks/useToast"
import { usePagination } from "@/hooks/usePagination"
import { useUrlFilter } from "@/hooks/useUrlFilter"
import { searchItems, formatDate } from "@/lib/utils"
import { getNewsColor, translateNewsCategory, categoryFilterOptions } from "@/lib/news-helpers"
import { getAllNews, deleteNews } from "@/services/news.service"
import { Edit3 } from "lucide-react"

import type { News as NewsType } from "@/types/news"

export const NewsAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const deferredSearch = useDeferredValue(searchTerm)
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { filterValue: selectedCategory, setFilter: handleCategoryChange } = 
    useUrlFilter({ paramName: "category" })

  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [addAlertOpen, setAddAlertOpen] = useState(false)

  // Data fetching with React Query
  const category = selectedCategory !== "all" ? (selectedCategory as NewsType["category"]) : undefined
  const {
    data: news = [],
    isPending,
    isError,
    refetch,
  } = useQuery<NewsType[]>({
    queryKey: ["news", category ?? "all"],
    queryFn: () => getAllNews(category),
  })

  // Filtrage optimisé avec useMemo
  const filteredNews = useMemo(() => {
    return searchItems(
      news, 
      deferredSearch, 
      ["title", "excerpt"]
    )
  }, [news, deferredSearch])

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    totalItems,
    goToPage,
    resetPagination
  } = usePagination<NewsType>({ data: filteredNews, itemsPerPage: 10 })

  React.useEffect(() => { resetPagination() }, [deferredSearch, selectedCategory]) // eslint-disable-line

  const requestDelete = (id: string) => {
    setDeleteTargetId(id)
    setDeleteAlertOpen(true)
  }

  // Delete mutation
  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationKey: ["news", "delete"],
    mutationFn: (id: string) => deleteNews(id),
    onSuccess: () => {
      toast.success("Actualité supprimée !", "L'actualité a bien été supprimée.")
      queryClient.invalidateQueries({ queryKey: ["news"] })
    },
    onError: () => {
      toast.error("Erreur", "Impossible de supprimer l'actualité.")
    },
  })

  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      deleteMutate(deleteTargetId)
    }
    setDeleteTargetId(null)
    setDeleteAlertOpen(false)
  }

  if (isPending) {
    return <Loader message="Chargement des actualités..." />
  }

  if (isError) {
    return (
      <ErrorPage
        title="Erreur de chargement"
        message="Une erreur est survenue lors du chargement des actualités. Veuillez réessayer."
        onRetry={() => refetch()}
        onGoBack={() => navigate('/admin')}
      />
    )
  }

  return (
  <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-foreground">Actualités</h2>
        <Button className="w-full sm:w-auto" onClick={() => setAddAlertOpen(true)}>
          Nouvelle Actualité
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-end rounded-lg border border-border bg-surface-2/35 p-3 mb-4">
        <Input
          placeholder="Rechercher une actualité..."
          value={searchTerm}
          onChange={setSearchTerm}
          className="flex-1"
        />
        <Select
          options={categoryFilterOptions}
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="md:max-w-xs"
        />
      </div>

      <div className="grid gap-4">
        {paginatedData.map((news) => (
          <Card 
            key={news.id} 
            className="p-4 md:p-5 cursor-pointer"
            onClick={() => navigate(`/admin/news/edit/${news.id}`)}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground truncate max-w-xs md:max-w-md">{news.title}</h3>
                  <span className={`px-2 py-1 ${getNewsColor(news.category)} text-xs rounded-full font-semibold`}>
                    {translateNewsCategory(news.category)}
                  </span>
                </div>
                <p className="line-clamp-2 border-t border-border/60 pt-3 text-muted-foreground">{news.excerpt}</p>
                <div className="text-xs text-muted-foreground">
                  Par {news.author ? `${news.author.firstname} ${news.author.lastname}` : "Auteur inconnu"} • {formatDate(news.created_at)}
                </div>
                {news.updated_by && news.updated_by_id !== news.author_id && (
                  <div className="flex items-center gap-1 text-xs text-info-foreground mt-1">
                    <Edit3 className="w-3 h-3" />
                    <span>Modifié par {news.updated_by.firstname} {news.updated_by.lastname}</span>
                  </div>
                )}
              </div>
              <div className="shrink-0 md:ml-4">
                <div className="flex gap-2 md:flex-col">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/admin/news/edit/${news.id}`)
                  }}
                >
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    requestDelete(news.id)
                  }}
                  disabled={isDeleting}
                >
                  Supprimer
                </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

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

      <Alert
        title="Supprimer cette actualité ?"
        description="Cette action est irréversible. La suppression ne peut pas être annulée."
        confirmText="Supprimer"
        cancelText="Annuler"
        open={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        onConfirm={confirmDelete}
      />

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
