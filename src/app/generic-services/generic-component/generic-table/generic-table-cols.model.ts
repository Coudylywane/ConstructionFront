export enum MdsColType {
  "text",
  "date",
  "dateWithTime",
  "progress",
  "amount", /* formatage correct avec le symbole FCFA, exemple : 1 000 000 F FCA */
  'amountWithoutSymbol', /* pour des besoins d'ergonomie, on n'affiche pas le symbole FCFA, mais n'empêche le montant sera formaté, exemple : 1 000 000  */
  "percent",
  "applicationType",
  "status",
  "clientType",
  "statusSubField",
  "applicationTypeSubField",
  "supplier",
  "loadHistoryStatus",
  'phaseStatusSite',
  'reservationStatus',
  'statusSiteInPhase',
  'clientTypeIdrFo',
  'statusIdrApp',
  'statusAdvanceFsApp',
  'reasonIdr',
  'statusParcelReservation',
  'statusParcelProperties',
  'statusPaymentReservation',
  'statusPaymentOffer',
  "loadHistoryStatusDetail",
  'offreStatus',
  'penaltyNature',
  'paramsSecoursStatus'
}

export class MdsTableCols {
  field: string
  subField?: string
  header: string
  type?: any = MdsColType
  width?: string
  multiSelectOptions?: any[]
  selectOptions?: any[]
  onMultiSelect?: ($event: any) => void
  onDateSelect?: ($event: any) => void
  sortable?: boolean
  filterable?: boolean
  searcheable?: boolean
  multiselectable?: boolean
  selectable?: boolean

  constructor(obj: any = {}) {
    this.field = obj.field
    this.subField = obj.subField
    this.header = obj.header
    this.type = obj.type ?? "text"
    this.width = obj.width
    this.multiSelectOptions = obj.multiSelectOptions
    this.selectOptions = obj.selectOptions
    this.onMultiSelect = obj.onMultiSelect
    this.onDateSelect = obj.onMultiSelect
    this.sortable = obj.sortable
    this.filterable = obj.filterable
    this.searcheable = obj.searcheable
    this.multiselectable = obj.multiselectable
    this.selectable = obj.selectable
  }
}
