import { useDeferredValue, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Edit3, User, Zap } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input"
import { Select } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Pagination } from "@/components/Pagination"
import { Loader } from "@/components/Loader"

import { usePagination } from "@/hooks/usePagination"
import { useUrlFilter } from "@/hooks/useUrlFilter"
import { searchItems, formatDate } from "@/lib/utils"
import { categoryFilterOptions, getNewsColor, getNewsIcon, translateNewsCategory } from "@/lib/news-helpers"
import { getAllNews } from "@/services/news.service"

import { ErrorPage } from "./errors/ErrorPage"
import type { News as NewsType } from "@/types/news"

export const News = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const deferredSearch = useDeferredValue(searchTerm)
  const { filterValue: categoryFilter, setFilter: setCategoryFilter } = useUrlFilter({ paramName: "category" })

  const category = categoryFilter !== "all" ? (categoryFilter as NewsType["category"]) : undefined

  const { data: allNews = [], isPending, isError, refetch } = useQuery<NewsType[]>({
    queryKey: ["news", category ?? "all"],
    queryFn: () => getAllNews(category),
  })

  const filteredNews = useMemo(() => searchItems(allNews, deferredSearch, ["title", "excerpt", "category"]), [deferredSearch, allNews])

  const { currentPage, totalPages, paginatedData: paginatedNews, totalItems, goToPage, resetPagination } = usePagination({ data: filteredNews, itemsPerPage: 6 })

  useEffect(() => {
    resetPagination()
  }, [deferredSearch, categoryFilter, resetPagination])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  if (isPending) return <Loader message="Chargement des actualites..." />
  if (isError) {
    return <ErrorPage title="Erreur de chargement" message="Impossible de charger les actualites" onRetry={() => refetch()} onGoBack={() => navigate("/home")} />
  }

  return (
    <div>
      <section className="page-hero section-shell p-8 md:p-10">
        <div className="relative z-10 text-center">
          <h1 className="text-h1 text-white">Toutes les Actualites</h1>
          <p className="mx-auto mt-3 max-w-3xl text-lg text-white/85">Restez informe des dernieres nouvelles du FC Popcorn.</p>
        </div>
      </section>

      <section className="section-shell">
        <Card variant="glass" className="p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <Input placeholder="Rechercher une actualite, un mot-cle..." value={searchTerm} onChange={setSearchTerm} className="flex-1" />
            <Select options={categoryFilterOptions} value={categoryFilter} onChange={setCategoryFilter} className="md:max-w-xs" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{filteredNews.length} actualite{filteredNews.length > 1 ? "s" : ""} trouvee{filteredNews.length > 1 ? "s" : ""}</p>
        </Card>
      </section>

      <section className="section-shell">
        {paginatedNews.length === 0 ? (
          <Card variant="glass" className="py-16 text-center">
            <Zap className="mx-auto mb-3 h-12 w-12 text-primary" />
            <h3 className="text-h3">Aucune actualite trouvee</h3>
            <p className="mt-2 text-muted-foreground">Essayez de modifier vos filtres.</p>
          </Card>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {paginatedNews.map((news) => {
                const Icon = getNewsIcon(news.category)
                const categoryColor = getNewsColor(news.category)
                const authorName = news.author ? `${news.author.firstname} ${news.author.lastname}` : "Auteur inconnu"

                return (
                  <Card key={news.id} variant="interactive" className="flex h-full cursor-pointer flex-col overflow-hidden" onClick={() => navigate(`/news/${news.id}`)}>
                    <div className={`flex h-40 items-center justify-center ${categoryColor}`}>
                      <Icon className="h-14 w-14" />
                    </div>

                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <span className={`mb-3 inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${categoryColor}`}>
                        {translateNewsCategory(news.category)}
                      </span>

                      <h3 className="mb-2 line-clamp-2 text-xl font-semibold text-foreground">{news.title}</h3>

                      <div className="mb-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(news.created_at)}</span>
                        <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" />{authorName}</span>
                      </div>

                      {news.updated_by && news.updated_by_id !== news.author_id && (
                        <p className="mb-2 inline-flex items-center gap-1 text-xs text-info-foreground"><Edit3 className="h-3 w-3" />Modifie par {news.updated_by.firstname} {news.updated_by.lastname}</p>
                      )}

                      <p className="line-clamp-3 flex-1 border-t border-border/60 pt-3 text-sm text-muted-foreground">{news.excerpt}</p>

                      <Button variant="secondary" className="mt-1 w-full" onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/news/${news.id}`)
                      }}>
                        Lire la suite
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>

            <div className="mt-6">
              <Pagination currentPage={currentPage} totalPages={totalPages} itemsPerPage={6} totalItems={totalItems} onPageChange={goToPage} itemName="actualites" />
            </div>
          </>
        )}
      </section>
    </div>
  )
}
