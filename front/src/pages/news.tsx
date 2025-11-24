import { useState, useMemo, useEffect, useDeferredValue } from "react"
import { useNavigate } from "react-router-dom"
import { Zap, Calendar, User, Edit3 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Select } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Pagination } from "@/components/Pagination"
import { Loader } from "@/components/Loader"

import { usePagination } from "@/hooks/usePagination"
import { useUrlFilter } from "@/hooks/useUrlFilter"
import { searchItems, formatDate } from "@/lib/utils"
import {
  getNewsIcon,
  getNewsColor,
  translateNewsCategory,
  categoryFilterOptions,
} from "@/lib/news-helpers"
import { getAllNews } from "@/services/news.service"

import { ErrorPage } from "./errors/ErrorPage"
import type { News as NewsType } from "@/types/news"

export const News = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const deferredSearch = useDeferredValue(searchTerm)

  const { filterValue: categoryFilter, setFilter: setCategoryFilter } = 
    useUrlFilter({ paramName: "category" })

  const category =
    categoryFilter !== "all" ? (categoryFilter as NewsType["category"]) : undefined

  const { 
    data: allNews = [], 
    isPending, 
    isError, 
    refetch 
  } = useQuery<NewsType[]>({
    queryKey: ["news", category ?? "all"],
    queryFn: () => getAllNews(category),
  })

  const filteredNews = useMemo(
    () => searchItems(allNews, deferredSearch, ["title", "excerpt", "category"]),
    [deferredSearch, allNews]
  )

  // pagination
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedNews,
    totalItems,
    goToPage,
    resetPagination,
  } = usePagination({ data: filteredNews, itemsPerPage: 6 })

  useEffect(() => {
    resetPagination()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredSearch, categoryFilter])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  if (isPending) return <Loader message="Chargement des actualités..." />

  if (isError) {
    return (
      <ErrorPage
        title="Erreur de chargement"
        message="Impossible de charger les actualités"
        onRetry={() => refetch()}
        onGoBack={() => navigate("/home")}
      />
    )
  }

  return (
    <div>
      <section className="bg-gradient-to-r from-primary to-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-background mb-4">
            Toutes les Actualités
          </h1>
          <p className="text-xl text-background/90">
            Restez informé de toutes les nouvelles du FC Popcorn
          </p>
        </div>
      </section>

      <section className="py-6 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <Input
              placeholder="Rechercher une actualité, un auteur, un mot-clé..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="flex-1"
            />
            <Select
              options={categoryFilterOptions}
              value={categoryFilter}
              onChange={setCategoryFilter}
              className="md:max-w-xs"
            />
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            {filteredNews.length} actualité
            {filteredNews.length > 1 ? "s" : ""} trouvée
            {filteredNews.length > 1 ? "s" : ""}
          </div>
        </div>
      </section>

      <section className="py-8">
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
                  const authorName = news.author
                    ? `${news.author.firstname} ${news.author.lastname}`
                    : "Auteur inconnu"

                  return (
                    <Card
                      key={news.id}
                      className="overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:border-primary flex flex-col h-full"
                      onClick={() => navigate(`/news/${news.id}`)}
                    >
                      <div className={`h-48 ${categoryColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-20 h-20" />
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <div className="mb-3">
                          <span className={`py-1 rounded-full text-sm font-medium ${categoryColor}`}>
                            {translateNewsCategory(news.category)}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                          {news.title}
                        </h3>

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
                        {news.updated_by && news.updated_by_id !== news.author_id && (
                          <div className="flex items-center gap-1 text-xs text-info-foreground mb-2">
                            <Edit3 className="w-3 h-3" />
                            <span>Modifié par {news.updated_by.firstname} {news.updated_by.lastname}</span>
                          </div>
                        )}

                        <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                          {news.excerpt}
                        </p>

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
      </section>
    </div>
  )
}