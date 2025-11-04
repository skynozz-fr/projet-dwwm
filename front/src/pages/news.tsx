import { useState, useMemo, useEffect, useCallback } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Zap, Calendar, User } from "lucide-react"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Select } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Pagination } from "@/components/Pagination"
import { Loader } from "@/components/Loader"
import { usePagination } from "@/hooks/usePagination"
import { filterItems, formatDate } from "@/lib/utils"
import { getNewsIcon, getNewsColor, translateNewsCategory, categoryFilterOptions } from "@/lib/news-helpers"
import { getAllNews } from "@/services/news.service"
import { ErrorPage } from "./errors/ErrorPage"
import type { News as NewsType } from "@/types/news"

export const News = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [allNews, setAllNews] = useState<NewsType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Récupérer la catégorie depuis l'URL
  const categoryFilter = searchParams.get("category") || "all"

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

  // Fetch
  const fetchNews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const category =
        categoryFilter !== "all" ? (categoryFilter as NewsType["category"]) : undefined
      const data = await getAllNews(category)
      setAllNews(data)
    } catch (err) {
      console.error("Erreur lors du chargement des actualités:", err)
      setError("Impossible de charger les actualités")
    } finally {
      setLoading(false)
    }
  }, [categoryFilter])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  // Filtrage des actualités
  const filteredNews = useMemo(() => {
    return filterItems(
      allNews,
      searchTerm,
      ['title', 'excerpt', 'category']
    )
  }, [searchTerm, allNews])

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedNews,
    totalItems,
    goToPage,
    resetPagination
  } = usePagination({ data: filteredNews, itemsPerPage: 6 })

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, categoryFilter])

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

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
        onGoBack={() => navigate('/home')}
      />
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-background mb-4">
            Toutes les Actualités
          </h1>
          <p className="text-xl text-background/90">
            Restez informé de toutes les nouvelles du FC Popcorn
          </p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="py-6 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            {/* Barre de recherche */}
            <Input
              label=""
              placeholder="Rechercher une actualité, un auteur, un mot-clé..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="flex-1"
            />

            {/* Filtre par catégorie */}
            <Select
              label=""
              options={categoryFilterOptions}
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="md:max-w-xs"
            />
          </div>

          {/* Résultats */}
          <div className="mt-4 text-sm text-muted-foreground">
            {filteredNews.length} actualité{filteredNews.length > 1 ? 's' : ''} trouvée{filteredNews.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Liste des actualités */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {paginatedNews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Zap className="w-16 h-16 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Aucune actualité trouvée
              </h3>
              <p className="text-muted-foreground text-center">
                Essayez de modifier vos critères de recherche ou de filtrage
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedNews.map((news) => {
                  const Icon = getNewsIcon(news.category)
                  const categoryColor = getNewsColor(news.category)
                  const authorName = news.author ? `${news.author.firstname} ${news.author.lastname}` : "Auteur inconnu"
                  return (
                    <Card
                      key={news.id}
                      className="overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:border-primary flex flex-col h-full"
                      onClick={() => navigate(`/news/${news.id}`)}
                    >
                      {/* Image placeholder avec icône */}
                      <div className={`h-48 ${categoryColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-20 h-20" />
                      </div>

                      {/* Contenu */}
                      <div className="p-6 flex flex-col flex-1">
                        {/* Catégorie */}
                        <div className="mb-3">
                          <span className={`py-1 rounded-full text-sm font-medium ${categoryColor}`}>
                            {translateNewsCategory(news.category)}
                          </span>
                        </div>

                        {/* Titre */}
                        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                          {news.title}
                        </h3>

                        {/* Métadonnées */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(news.created_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {authorName}
                          </div>
                        </div>

                        {/* Extrait */}
                        <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                          {news.excerpt}
                        </p>

                        {/* Bouton */}
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/news/${news.id}`)
                          }}
                        >
                          Lire la suite
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={6}
                totalItems={totalItems}
                onPageChange={goToPage}
                itemName="actualités"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
