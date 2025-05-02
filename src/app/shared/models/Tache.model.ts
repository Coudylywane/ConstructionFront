export interface Tache {
  id: number;
  nom: string;
  description: string;
  dureeEstimee: number;
  dateDebut: string;
  dateFin: string;
  status: string;
  pourcentageExecution: number;
  selected?: boolean;
  articles: TacheArticle[];
}

export interface TacheArticle {
  articleId: number;
  quantiteUtilisee: number;
}

// export interface Article {
//   id: number;
//   nom: string;
// }

export interface Article {
  id: number;
  code: string | undefined;
  designation: string | undefined;
  description: string | undefined;
  poids: number | undefined;
  prixAchatUnitaire: number | undefined;
  prixReviensUnitaire: number | undefined;
  prixVenteUnitaire: number | undefined;
  prixDevis: number | undefined;
  prixReel: number | undefined;
  quantity: number | undefined;
  status: string | undefined;
  quantiteSeuil: number | undefined;
}