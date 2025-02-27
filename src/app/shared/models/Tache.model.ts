export interface Tache {
  id?: number;
  nom?: string;
  description?: string;
  dureeEstimee?: number;
  statut?: string;
  dateDebut?: string; // Format 'YYYY-MM-DD'
  dateFin?: string;
  pourcentageExecution?: number;
  selected?: boolean;
}
