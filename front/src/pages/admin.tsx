import { useState } from "react"
import { Users, FileText, Calendar, Plus, Edit, Trash2 } from "lucide-react"

import Input from "@/components/Input"
import Select from "@/components/Select"
import Textarea from "@/components/Textarea"
import { Button } from "@/components/Button"
import { Pagination } from "@/components/Pagination"
import { usePagination } from "@/hooks/usePagination"

interface Actualite {
  id: number
  title: string
  date: string
  author: string
  category: string
  excerpt: string
  content: string
}

interface Match {
  id: number
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  venue: string
  location: string
  competition: string
  status: string
  homeScore: number | null
  awayScore: number | null
  description: string
  homeFormation: string
  awayFormation: string
  referee: string
  weather: string
}

interface User {
  id: number
  nom: string
  email: string
  role: string
}

export const Admin = () => {
  const [activeTab, setActiveTab] = useState("actualites")
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState<Actualite | Match | User | null>(null)

  // Pagination hooks
  const ITEMS_PER_PAGE = 5
  
  // États pour les formulaires
  const [formData, setFormData] = useState({
    // Actualités
    title: "",
    author: "",
    category: "",
    excerpt: "",
    content: "",
    date: "",
    // Matchs
    homeTeam: "",
    awayTeam: "",
    time: "",
    venue: "",
    location: "",
    competition: "",
    status: "",
    homeScore: "",
    awayScore: "",
    description: "",
    homeFormation: "",
    awayFormation: "",
    referee: "",
    weather: "",
    // Utilisateurs
    nom: "",
    email: "",
    role: "user"
  })

  // Données d'exemple
  const [actualites, setActualites] = useState([
    {
      id: 1,
      title: "Victoire en finale de coupe !",
      date: "10 Juillet 2025",
      author: "Équipe Communication",
      category: "Compétition",
      excerpt: "Une victoire historique 3-1 face aux Aigles Dorés nous offre notre 15ème trophée. Félicitations à toute l'équipe !",
      content: "Quelle soirée magique ! Nos joueurs ont livré une performance exceptionnelle...",
    },
    {
      id: 2,
      title: "Nouveau recrutement !",
      date: "5 Juillet 2025",
      author: "Direction Sportive",
      category: "Transferts",
      excerpt: "Nous accueillons 3 nouveaux joueurs talentueux qui renforceront notre équipe première. Bienvenue à eux !",
      content: "Le FC Popcorn est fier d'annoncer l'arrivée de trois nouveaux joueurs...",
    },
    {
      id: 3,
      title: "Préparation d'avant-saison",
      date: "1 Juillet 2025",
      author: "Staff Technique",
      category: "Préparation",
      excerpt: "Début de la préparation physique avec un stage intensif de 15 jours.",
      content: "L'équipe se prépare pour la nouvelle saison avec un programme d'entraînement intensif...",
    },
    {
      id: 4,
      title: "Nouveau partenariat",
      date: "28 Juin 2025",
      author: "Direction",
      category: "Actualité",
      excerpt: "Signature d'un partenariat avec SportMax pour l'équipement de l'équipe.",
      content: "Nous sommes fiers d'annoncer notre nouveau partenariat...",
    },
    {
      id: 5,
      title: "Match de gala caritatif",
      date: "25 Juin 2025",
      author: "Équipe Communication",
      category: "Actualité",
      excerpt: "Organisation d'un match caritatif au profit de l'association locale.",
      content: "Dans le cadre de notre engagement social...",
    },
    {
      id: 6,
      title: "Inauguration du nouveau terrain",
      date: "20 Juin 2025",
      author: "Direction",
      category: "Actualité",
      excerpt: "Inauguration officielle de notre nouveau terrain d'entraînement.",
      content: "Après plusieurs mois de travaux...",
    }
  ])

  const [matchs, setMatchs] = useState([
    {
      id: 1,
      homeTeam: "FC Popcorn",
      awayTeam: "AS Rivaux",
      date: "15 Juillet 2025",
      time: "15h00",
      venue: "Stade Municipal",
      location: "Domicile",
      competition: "Championnat",
      status: "À venir",
      homeScore: null,
      awayScore: null,
      description: "Match crucial pour le maintien en tête du championnat. Nos adversaires sont redoutables mais nous sommes confiants dans nos capacités.",
      homeFormation: "4-3-3",
      awayFormation: "4-4-2",
      referee: "M. Dupont",
      weather: "Ensoleillé, 24°C"
    },
    {
      id: 2,
      homeTeam: "FC Champions",
      awayTeam: "FC Popcorn",
      date: "22 Juillet 2025",
      time: "17h30",
      venue: "Stade des Champions",
      location: "Extérieur",
      competition: "Coupe",
      status: "À venir",
      homeScore: null,
      awayScore: null,
      description: "Quart de finale de coupe face à une équipe de division supérieure. Un défi de taille qui nous motive énormément !",
      homeFormation: "4-2-3-1",
      awayFormation: "4-3-3",
      referee: "Mme Martin",
      weather: "Nuageux, 21°C"
    },
    {
      id: 3,
      homeTeam: "FC Popcorn",
      awayTeam: "Olympique Local",
      date: "29 Juillet 2025",
      time: "20h00",
      venue: "Stade Municipal",
      location: "Domicile",
      competition: "Championnat",
      status: "À venir",
      homeScore: null,
      awayScore: null,
      description: "Derby local très attendu par les supporters.",
      homeFormation: "4-3-3",
      awayFormation: "3-5-2",
      referee: "M. Petit",
      weather: "Clair, 26°C"
    },
    {
      id: 4,
      homeTeam: "Sporting Ville",
      awayTeam: "FC Popcorn",
      date: "5 Août 2025",
      time: "16h00",
      venue: "Stade Central",
      location: "Extérieur",
      competition: "Championnat",
      status: "À venir",
      homeScore: null,
      awayScore: null,
      description: "Déplacement difficile contre une équipe bien classée.",
      homeFormation: "4-4-2",
      awayFormation: "4-3-3",
      referee: "Mme Rousseau",
      weather: "Variable, 22°C"
    },
    {
      id: 5,
      homeTeam: "FC Popcorn",
      awayTeam: "United FC",
      date: "12 Août 2025",
      time: "18h30",
      venue: "Stade Municipal",
      location: "Domicile",
      competition: "Coupe",
      status: "À venir",
      homeScore: null,
      awayScore: null,
      description: "Demi-finale de coupe, l'occasion de se qualifier pour la finale.",
      homeFormation: "4-3-3",
      awayFormation: "4-2-3-1",
      referee: "M. Lambert",
      weather: "Ensoleillé, 28°C"
    },
    {
      id: 6,
      homeTeam: "Athletic Club",
      awayTeam: "FC Popcorn",
      date: "19 Août 2025",
      time: "15h00",
      venue: "Stade Régional",
      location: "Extérieur",
      competition: "Championnat",
      status: "À venir",
      homeScore: null,
      awayScore: null,
      description: "Match important pour maintenir notre position au classement.",
      homeFormation: "3-4-3",
      awayFormation: "4-3-3",
      referee: "M. Moreau",
      weather: "Partiellement nuageux, 25°C"
    }
  ])

  const [users, setUsers] = useState([
    { id: 1, nom: "Jean Dupont", email: "jean@example.com", role: "user" },
    { id: 2, nom: "Marie Martin", email: "marie@example.com", role: "admin" },
    { id: 3, nom: "Pierre Durand", email: "pierre@example.com", role: "user" },
    { id: 4, nom: "Sophie Leroy", email: "sophie@example.com", role: "user" },
    { id: 5, nom: "Nicolas Moreau", email: "nicolas@example.com", role: "admin" },
    { id: 6, nom: "Emma Dubois", email: "emma@example.com", role: "user" },
    { id: 7, nom: "Lucas Bernard", email: "lucas@example.com", role: "user" }
  ])

  // Pagination hooks
  const actualitesPagination = usePagination({ data: actualites, itemsPerPage: ITEMS_PER_PAGE })
  const matchsPagination = usePagination({ data: matchs, itemsPerPage: ITEMS_PER_PAGE })
  const usersPagination = usePagination({ data: users, itemsPerPage: ITEMS_PER_PAGE })

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      category: "",
      excerpt: "",
      content: "",
      date: "",
      homeTeam: "",
      awayTeam: "",
      time: "",
      venue: "",
      location: "",
      competition: "",
      status: "",
      homeScore: "",
      awayScore: "",
      description: "",
      homeFormation: "",
      awayFormation: "",
      referee: "",
      weather: "",
      nom: "",
      email: "",
      role: "user"
    })
    setIsEditing(false)
    setEditingItem(null)
  }

  const handleEdit = (item: Actualite | Match | User) => {
    setEditingItem(item)
    setIsEditing(true)
    // Pré-remplir le formulaire
    if ('title' in item) {
      // Actualité
      setFormData(prev => ({
        ...prev,
        title: item.title,
        author: item.author,
        category: item.category,
        excerpt: item.excerpt,
        content: item.content,
        date: item.date
      }))
    } else if ('homeTeam' in item) {
      // Match
      setFormData(prev => ({
        ...prev,
        homeTeam: item.homeTeam,
        awayTeam: item.awayTeam,
        date: item.date,
        time: item.time,
        venue: item.venue,
        location: item.location,
        competition: item.competition,
        status: item.status,
        homeScore: item.homeScore?.toString() || "",
        awayScore: item.awayScore?.toString() || "",
        description: item.description,
        homeFormation: item.homeFormation,
        awayFormation: item.awayFormation,
        referee: item.referee,
        weather: item.weather
      }))
    } else if ('nom' in item) {
      // User
      setFormData(prev => ({
        ...prev,
        nom: item.nom,
        email: item.email,
        role: item.role
      }))
    }
  }

  const handleUserRoleChange = (userId: number, newRole: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ))
  }

  const handleDelete = (id: number, type: string) => {
    if (type === "actualites") {
      const newActualites = actualites.filter(item => item.id !== id)
      setActualites(newActualites)
      // Réinitialiser la pagination si on supprime le dernier élément d'une page
      if (newActualites.length <= (actualitesPagination.currentPage - 1) * ITEMS_PER_PAGE && actualitesPagination.currentPage > 1) {
        actualitesPagination.goToPage(actualitesPagination.currentPage - 1)
      }
    } else if (type === "matchs") {
      const newMatchs = matchs.filter(item => item.id !== id)
      setMatchs(newMatchs)
      if (newMatchs.length <= (matchsPagination.currentPage - 1) * ITEMS_PER_PAGE && matchsPagination.currentPage > 1) {
        matchsPagination.goToPage(matchsPagination.currentPage - 1)
      }
    } else if (type === "users") {
      const newUsers = users.filter(item => item.id !== id)
      setUsers(newUsers)
      if (newUsers.length <= (usersPagination.currentPage - 1) * ITEMS_PER_PAGE && usersPagination.currentPage > 1) {
        usersPagination.goToPage(usersPagination.currentPage - 1)
      }
    }
  }

  const renderActualites = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Actualités</h2>
        <Button onClick={() => { resetForm(); setIsEditing(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle actualité
        </Button>
      </div>

      {isEditing && (
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? "Modifier l'actualité" : "Nouvelle actualité"}
          </h3>
          <div className="space-y-4">
            <Input 
              label="Titre" 
              placeholder="Titre de l'actualité" 
              value={formData.title} 
              onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
            />
            <Input 
              label="Auteur" 
              placeholder="Nom de l'auteur" 
              value={formData.author} 
              onChange={(value) => setFormData(prev => ({ ...prev, author: value }))}
            />
            <Select 
              label="Catégorie" 
              value={formData.category}
              onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              options={[
                { value: "Compétition", label: "Compétition" },
                { value: "Transferts", label: "Transferts" },
                { value: "Préparation", label: "Préparation" },
                { value: "Actualité", label: "Actualité" }
              ]}
            />
            <Input 
              label="Résumé" 
              placeholder="Résumé de l'actualité" 
              value={formData.excerpt} 
              onChange={(value) => setFormData(prev => ({ ...prev, excerpt: value }))}
            />
            <Textarea 
              label="Contenu" 
              placeholder="Contenu de l'actualité" 
              value={formData.content} 
              onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
            />
            <Input 
              label="Date" 
              type="date" 
              value={formData.date} 
              onChange={(value) => setFormData(prev => ({ ...prev, date: value }))}
            />
            <div className="flex gap-2">
              <Button>Sauvegarder</Button>
              <Button variant="ghost" onClick={resetForm}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {actualitesPagination.paginatedData.map((actualite) => (
          <div key={actualite.id} className="bg-card p-4 rounded-lg border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold">{actualite.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{actualite.excerpt}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{actualite.category}</span>
                  <span className="text-xs text-muted-foreground">{actualite.author}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Date: {actualite.date}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(actualite)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(actualite.id, "actualites")}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={actualitesPagination.currentPage}
        totalPages={actualitesPagination.totalPages}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={actualitesPagination.totalItems}
        onPageChange={actualitesPagination.goToPage}
        itemName="actualités"
      />
    </div>
  )

  const renderMatchs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Matchs</h2>
        <Button onClick={() => { resetForm(); setIsEditing(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau match
        </Button>
      </div>

      {isEditing && (
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? "Modifier le match" : "Nouveau match"}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Équipe à domicile" 
                placeholder="Nom de l'équipe à domicile" 
                value={formData.homeTeam} 
                onChange={(value) => setFormData(prev => ({ ...prev, homeTeam: value }))}
              />
              <Input 
                label="Équipe visiteur" 
                placeholder="Nom de l'équipe visiteur" 
                value={formData.awayTeam} 
                onChange={(value) => setFormData(prev => ({ ...prev, awayTeam: value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Date du match" 
                type="date" 
                value={formData.date} 
                onChange={(value) => setFormData(prev => ({ ...prev, date: value }))}
              />
              <Input 
                label="Heure" 
                placeholder="Ex: 15h00" 
                value={formData.time} 
                onChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Lieu" 
                placeholder="Ex: Stade Municipal" 
                value={formData.venue} 
                onChange={(value) => setFormData(prev => ({ ...prev, venue: value }))}
              />
              <Select 
                label="Localisation" 
                value={formData.location}
                onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                options={[
                  { value: "Domicile", label: "Domicile" },
                  { value: "Extérieur", label: "Extérieur" }
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select 
                label="Compétition" 
                value={formData.competition}
                onChange={(value) => setFormData(prev => ({ ...prev, competition: value }))}
                options={[
                  { value: "Championnat", label: "Championnat" },
                  { value: "Coupe", label: "Coupe" },
                  { value: "Amical", label: "Amical" }
                ]}
              />
              <Select 
                label="Statut" 
                value={formData.status}
                onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                options={[
                  { value: "À venir", label: "À venir" },
                  { value: "En cours", label: "En cours" },
                  { value: "Terminé", label: "Terminé" }
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Score équipe domicile" 
                placeholder="Ex: 3"
                type="number"
                value={formData.homeScore} 
                onChange={(value) => setFormData(prev => ({ ...prev, homeScore: value }))}
              />
              <Input 
                label="Score équipe visiteur" 
                placeholder="Ex: 1"
                type="number"
                value={formData.awayScore} 
                onChange={(value) => setFormData(prev => ({ ...prev, awayScore: value }))}
              />
            </div>
            <Textarea 
              label="Description" 
              placeholder="Description du match" 
              value={formData.description} 
              onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Formation domicile" 
                placeholder="Ex: 4-3-3" 
                value={formData.homeFormation} 
                onChange={(value) => setFormData(prev => ({ ...prev, homeFormation: value }))}
              />
              <Input 
                label="Formation visiteur" 
                placeholder="Ex: 4-4-2" 
                value={formData.awayFormation} 
                onChange={(value) => setFormData(prev => ({ ...prev, awayFormation: value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Arbitre" 
                placeholder="Ex: M. Dupont" 
                value={formData.referee} 
                onChange={(value) => setFormData(prev => ({ ...prev, referee: value }))}
              />
              <Input 
                label="Météo" 
                placeholder="Ex: Ensoleillé, 24°C" 
                value={formData.weather} 
                onChange={(value) => setFormData(prev => ({ ...prev, weather: value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button>Sauvegarder</Button>
              <Button variant="ghost" onClick={resetForm}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {matchsPagination.paginatedData.map((match) => (
          <div key={match.id} className="bg-card p-4 rounded-lg border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold">{match.homeTeam} vs {match.awayTeam}</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Score: {match.homeScore !== null && match.awayScore !== null 
                    ? `${match.homeScore} - ${match.awayScore}` 
                    : "Non défini"}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{match.competition}</span>
                  <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">{match.status}</span>
                  <span className="text-xs text-muted-foreground">{match.location}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {match.date} à {match.time} - {match.venue}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(match)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(match.id, "matchs")}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={matchsPagination.currentPage}
        totalPages={matchsPagination.totalPages}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={matchsPagination.totalItems}
        onPageChange={matchsPagination.goToPage}
        itemName="matchs"
      />
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
      </div>

      <div className="space-y-4">
        {usersPagination.paginatedData.map((user) => (
          <div key={user.id} className="bg-card p-4 rounded-lg border">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-semibold">{user.nom}</h3>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
              <div className="flex items-center gap-4">
                <Select 
                  label="Rôle" 
                  value={user.role}
                  onChange={(value) => handleUserRoleChange(user.id, value)}
                  options={[
                    { value: "user", label: "Utilisateur" },
                    { value: "admin", label: "Admin" }
                  ]}
                />
                <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id, "users")}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={usersPagination.currentPage}
        totalPages={usersPagination.totalPages}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={usersPagination.totalItems}
        onPageChange={usersPagination.goToPage}
        itemName="utilisateurs"
      />
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "actualites":
        return renderActualites()
      case "matchs":
        return renderMatchs()
      case "users":
        return renderUsers()
      default:
        return <div>Contenu non trouvé</div>
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="space-y-2 px-4">
          <button
            onClick={() => setActiveTab("actualites")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
              activeTab === "actualites" 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted"
            }`}
          >
            <FileText className="w-4 h-4" />
            Actualités
          </button>
          <button
            onClick={() => setActiveTab("matchs")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
              activeTab === "matchs" 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Matchs
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
              activeTab === "users" 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted"
            }`}
          >
            <Users className="w-4 h-4" />
            Utilisateurs
          </button>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b p-4">
          <h2 className="text-lg font-semibold">Administration</h2>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
