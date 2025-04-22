import { DetailCommandeRequest } from "./detailCommande.model";

export class CommandeModel {
  numero!: string;
  date!: string;
  prixTotal!: number;
  detailsCommande!: DetailCommandeRequest[];
}
