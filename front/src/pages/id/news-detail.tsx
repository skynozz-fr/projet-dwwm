import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader } from "@/components/Loader"
import { ErrorPage } from "../errors/ErrorPage"
import { NotFound } from "../errors/NotFound"

import { ArrowLeft, BookOpen, Calendar, Edit3, User } from "lucide-react"

import { copyToClipboardWithToast, formatDate } from "@/lib/utils"
import { getNewsColor, getNewsIcon, translateNewsCategory } from "@/lib/news-helpers"
import { useToast } from "@/hooks/useToast"
import { getNewsById } from "@/services/news.service"

import type { News as NewsType } from "@/types/news"

export const NewsDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const { data: news, isPending, isError, refetch } = useQuery<NewsType>({
    queryKey: ["news", id],
    queryFn: () => getNewsById(id as string),
    enabled: !!id,
  })

  if (!id) return <ErrorPage title="Erreur de chargement" message="Identifiant d'actualite invalide" onGoBack={() => navigate("/news")} />
  if (isPending) return <Loader message="Chargement de l'actualite..." />
  if (isError) return <ErrorPage title="Erreur de chargement" message="Impossible de charger l'actualite" onRetry={() => refetch()} onGoBack={() => navigate("/news")} />
  if (!news) return <NotFound />

  const Icon = getNewsIcon(news.category)
  const iconColor = getNewsColor(news.category)

  return (
    <div>
      <section className="page-hero section-shell p-8 md:p-10">
        <div className="relative z-10">
          <Button variant="ghost" className="mb-6 text-white hover:bg-white/10" onClick={() => navigate("/news")}>
            <ArrowLeft className="h-4 w-4" />Retour aux actualites
          </Button>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white"><BookOpen className="h-4 w-4" />{translateNewsCategory(news.category)}</span>
            <h1 className="mt-4 text-h1 text-white">{news.title}</h1>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-white/85">
              <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(news.created_at)}</span>
              {news.author && <span className="inline-flex items-center gap-1"><User className="h-4 w-4" />{news.author.firstname} {news.author.lastname}</span>}
            </div>
            {news.updated_by && news.updated_by_id !== news.author_id && (
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-white/80"><Edit3 className="h-3 w-3" />Modifie par {news.updated_by.firstname} {news.updated_by.lastname}</p>
            )}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <Card variant="elevated" className="mx-auto max-w-4xl p-8">
          <div className={`mb-6 flex h-20 items-center justify-center rounded-lg ${iconColor}`}><Icon className="h-10 w-10" /></div>
          <p className="mb-6 rounded-lg border-l-4 border-primary bg-primary/10 p-4 text-base text-foreground">{news.excerpt}</p>
          <div className="space-y-4 text-foreground/95">
            {news.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="leading-7">{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 border-t border-border pt-5">
            <Button variant="secondary" onClick={() => copyToClipboardWithToast(window.location.href, toast)}>Partager</Button>
          </div>
        </Card>
      </section>
    </div>
  )
}
