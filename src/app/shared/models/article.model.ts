import { TypeArticleModel } from "./type-article.model";
import { UniteMesureModel } from "./unite-mesure.model";
import { ZoneStockModel } from "./zone-stock.model";

export class ArticleModel {
  public id: number | undefined;
  public code: string | undefined;
  public designation: string | undefined;
  public description: string | undefined;
  public poids: number | undefined;
  public prixAchatUnitaire: number | undefined;
  public prixReviensUnitaire: number | undefined;
  public prixVenteUnitaire: number | undefined;
  public status: number | undefined;
  public zoneStock: ZoneStockModel | undefined;
  public uniteMesure: UniteMesureModel | undefined;
  public typeArticle: TypeArticleModel | undefined;
  
}
