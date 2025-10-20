import React, { useState } from "react"
import { useToast } from "@/hooks/useToast"
import { usePagination } from "@/hooks/usePagination"
import { Pagination } from "@/components/Pagination"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Select } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import type { News } from "@/types/news"
import { filterItems } from "@/lib/utils"

// Données de test
const mockNews: News[] = [
  {
  id: 1,
  title: "Victoire écrasante contre l'équipe rivale",
  date: "2025-08-28",
  author: "Jean Dupont",
  category: "Match",
  excerpt: "Une performance exceptionnelle de nos joueurs...",
  content: "Contenu complet de la news..."
  },
  {
  id: 2,
  title: "Nouveau transfert en vue",
  date: "2025-08-25",
  author: "Marie Martin",
  category: "Transfert",
  excerpt: "Les négociations sont en cours...",
  content: "Contenu complet de la news..."
  },
  {
  id: 3,
  title: "Entraînement spécial cette semaine",
  date: "2025-08-22",
  author: "Pierre Dubois",
  category: "Transfert",
  excerpt: "Préparation intensive avant le prochain match...",
  content: "Contenu complet de la news..."
  }
]

export const NewsAdmin = () => {
  const [news, setNews] = useState<News[]>(mockNews)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const navigate = useNavigate()
  const { toast } = useToast()

  // Alerts state
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [addAlertOpen, setAddAlertOpen] = useState(false)

  const categories = ["all", "Match", "Transfert", "Entraînement"]


  const filteredNews = filterItems(
    news,
    searchTerm,
    ["title", "author"],
    { field: "category", value: selectedCategory }
  )

  // Pagination (10 items per page)
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

  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      setNews(prev => prev.filter(n => n.id !== deleteTargetId))
      toast.success("Actualité supprimée !", "L'actualité a bien été supprimée.")
    }
    setDeleteTargetId(null)
    setDeleteAlertOpen(false)
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
          label="Rechercher"
          placeholder="Rechercher une actualité..."
          value={searchTerm}
          onChange={setSearchTerm}
          className="max-w-xs"
        />
        <Select
          label="Catégorie"
          options={categories.map(cat => ({ 
            value: cat, 
            label: cat === "all" ? "Toutes les catégories" : cat 
          }))}
          value={selectedCategory}
          onChange={setSelectedCategory}
          className="max-w-xs"
        />
      </div>

      {/* Liste des news */}
      <div className="grid gap-6">
        {paginatedData.map((newsItem) => (
          <Card key={newsItem.id} className="p-5 md:p-7 border border-border bg-background/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground truncate max-w-xs md:max-w-md">{newsItem.title}</h3>
                  <span className="px-2 py-1 bg-primary text-secondary-foreground text-xs rounded-full font-semibold">
                    {newsItem.category}
                  </span>
                </div>
                <p className="text-muted-foreground mb-2 line-clamp-2">{newsItem.excerpt}</p>
                <div className="text-xs text-muted-foreground">
                  Par {newsItem.author} • {new Date(newsItem.date).toLocaleDateString('fr-FR')}
                </div>
              </div>
              <div className="flex gap-2 md:ml-4 shrink-0">
                <Button variant="secondary" size="sm">
                  <Link to={`/admin/news/edit/${newsItem.id}`}>
                    Modifier
                  </Link>
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => requestDelete(newsItem.id)}
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