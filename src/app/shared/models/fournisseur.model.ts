import { CategorieFournisseurModel } from "./categorie-fournisseur.model";
import { TypeFournisseurModel } from "./type-fournisseur.model";

export class FournisseurModel {
  public id: number | undefined;
  public nom: string | undefined;
  public adresse: string | undefined;
  public telephone: string | undefined;
  public email: string | undefined;
  public totalVersement: string | undefined;
  public solde: string | undefined;
  public status: number | undefined;
  public categorieFournisseur: CategorieFournisseurModel | undefined;
  public typeFournisseur: TypeFournisseurModel | undefined;
}
