import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/Button"
import { Loader } from "@/components/Loader"
import { ErrorPage } from "../errors/ErrorPage"
import { NotFound } from "../errors/NotFound"

import { Calendar, ArrowLeft, BookOpen, User, Edit3 } from "lucide-react"

import { copyToClipboardWithToast, formatDate } from "@/lib/utils"
import { getNewsIcon, getNewsColor, translateNewsCategory } from "@/lib/news-helpers"
import { useToast } from "@/hooks/useToast"
import { getNewsById } from "@/services/news.service"

import type { News as NewsType } from "@/types/news"

export const NewsDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const { 
    data: news, 
    isPending, 
    isError, 
    refetch 
  } = useQuery<NewsType>({
    queryKey: ["news", id],
    queryFn: () => getNewsById(id as string),
    enabled: !!id,
  })

  if (!id)
    return (
      <ErrorPage
        title="Erreur de chargement"
        message="Identifiant d'actualité invalide"
        onGoBack={() => navigate("/news")}
      />
    )

  if (isPending) return <Loader message="Chargement de l'actualité..." />

  if (isError)
    return (
      <ErrorPage
        title="Erreur de chargement"
        message="Impossible de charger l'actualité"
        onRetry={() => refetch()}
        onGoBack={() => navigate("/news")}
      />
    )

  if (!news) return <NotFound />

  const IconComponent = getNewsIcon(news.category)
  const iconColor = getNewsColor(news.category)
  const translatedCategory = translateNewsCategory(news.category)

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-secondary py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6 text-background hover:bg-background/20"
            onClick={() => navigate('/news')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux actualités
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center bg-background/20 px-4 py-2 rounded-full text-sm font-medium text-background mb-4">
              <BookOpen className="w-4 h-4 mr-2" />
              {translatedCategory}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-background mb-4">
              {news.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-background/90">
              <div className="flex items-center gap-1">
                <Calendar className="w-5 h-5" />
                {formatDate(news.created_at)}
              </div>
              {news.author && (
                <div className="flex items-center gap-1">
                  <User className="w-5 h-5" />
                  {news.author.firstname} {news.author.lastname}
                </div>
              )}
            </div>
            {news.updated_by && news.updated_by_id !== news.author_id && (
              <div className="mx-auto mt-3 flex w-fit items-center justify-center gap-1.5 text-sm text-info-foreground">
                <Edit3 className="w-4 h-4" />
                <span>Modifié par {news.updated_by.firstname} {news.updated_by.lastname}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg flex items-center justify-center mb-8">
            <IconComponent className={`w-12 h-12 ${iconColor}`} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-muted border border-border rounded-lg p-8">
          
          <div className="text-xl text-muted-foreground mb-8 p-4 bg-background rounded-lg border-l-4 border-primary">
            {news.excerpt}
          </div>

          <div 
            className="prose prose-lg max-w-none text-foreground"
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.75',
            }}
          >
            {news.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex items-center gap-4">
              <Button 
                variant="secondary"
                onClick={() => copyToClipboardWithToast(window.location.href, toast)}>
                Partager
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}