import { DetailCommandeRequest } from "./detailCommande.model";

export class CommandeModel {
  id?: number;
  numero?: string;
  date!: string;
  prixTotal!: number;
  status!: string;
  detailsCommande!: DetailCommandeRequest[];
}
