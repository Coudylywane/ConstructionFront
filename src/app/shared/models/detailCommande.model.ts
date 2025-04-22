export interface DetailCommande {
    id: number;
    article: { id: number };
    fournisseur: { id: number };
    nombre: number;
    prixTotal: number;
    commande: any;
  }

  // Pour l'envoi :
export interface DetailCommandeRequest {
        article: { id: number },
        fournisseur: any,   // obligatoire
        nombre: number      
    
      
  }