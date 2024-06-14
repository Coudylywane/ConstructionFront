import { FournisseurModel } from "./fournisseur.model";

export class ContactFournisseurModel {
  public id: number | undefined;
  public nom: string | undefined;
  public telephone: string | undefined;
  public email: string | undefined;
  public status: number | undefined;
  public fournisseur: FournisseurModel | undefined;
}
