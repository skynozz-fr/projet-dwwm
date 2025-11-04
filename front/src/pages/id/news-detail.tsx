import { useState, useEffect } from "react"
import { Button } from "@/components/Button"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, ArrowLeft, BookOpen, User } from "lucide-react"
import { copyToClipboardWithToast, formatDate } from "@/lib/utils"
import { getNewsIcon, getNewsColor, translateNewsCategory } from "@/lib/news-helpers"
import { useToast } from "@/hooks/useToast"
import { ErrorPage } from "../errors/ErrorPage"
import { Loader } from "@/components/Loader"
import { getNewsById } from "@/services/news.service"
import type { News } from "@/types/news"
import { NotFound } from "../errors/NotFound"

export const NewsDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Récupérer l'actualité depuis l'API
  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError(null)
        const data = await getNewsById(parseInt(id))
        setNews(data)
      } catch (err: unknown) {
        console.error("Erreur lors du chargement de l'actualité:", err)
        // Si ce n'est pas une 404, afficher une erreur générique
        type HttpErr = { response?: { status?: number } }
        const status = (err as HttpErr).response?.status
        if (status !== 404) {
          setError("Impossible de charger l'actualité")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [id])

  // État de chargement
  if (loading) {
    return <Loader message="Chargement de l'actualité..." />
  }

  // État d'erreur (problème serveur, réseau, 404, etc.)
  if (error) {
    return (
      <ErrorPage
        title="Erreur de chargement"
        message="Une erreur est survenue lors du chargement de l'actualité. Veuillez réessayer."
        onRetry={() => window.location.reload()}
        onGoBack={() => navigate('/news')}
      />
    )
  }

  if (!news) {
    return (
      <NotFound />  
    )
  }

  const IconComponent = getNewsIcon(news.category)
  const iconColor = getNewsColor(news.category)
  const translatedCategory = translateNewsCategory(news.category)

  return (
    <div>
      {/* Header */}
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
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg flex items-center justify-center mb-8">
            <IconComponent className={`w-12 h-12 ${iconColor}`} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-muted border border-border rounded-lg p-8">
          
          {/* Excerpt */}
          <div className="text-xl text-muted-foreground mb-8 p-4 bg-background rounded-lg border-l-4 border-primary">
            {news.excerpt}
          </div>

          {/* Article content */}
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
            {/* Share buttons */}
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
