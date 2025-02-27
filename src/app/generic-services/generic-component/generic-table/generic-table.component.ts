import { Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from "@angular/core"
import { MdsTableConfig } from "./generic-table-config.model"
import { MdsTableCols } from "./generic-table-cols.model"
import { RowSizes } from "./row-sizes.model"

import { Subscription, timer } from "rxjs"
import { GenericTableService } from "./generic-table.service"
import { MdsTableAction } from "./generic-table-action.model"
import { Table } from "primeng/table"
import { TranslateService } from "@ngx-translate/core"
import { PrimeNGConfig } from "primeng/api"
import { RouteService } from "../../../core/utils/route.service"
import { Util } from "../../util/util"
import { LocaleSettings } from "primeng/calendar/calendar"
import { SiteTrackingStatusEnum } from "../../prestation-sociale/models/cooperative-habitat/site-tracking-status"
import { ParcelProperty } from "../../prestation-sociale/models/cooperative-habitat/parcel-config"
import { SiteParcelPropertyEnum } from "../../prestation-sociale/models/cooperative-habitat/site-parcel-property"
import { ProjectUtil } from "../../util/project.util"
import { BuyerTypeRecord } from "../../prestation-sociale/models/cooperative-habitat/buyer-type"
import { PhaseTypeRecord } from "../../prestation-sociale/models/cooperative-habitat/phase-type"
import {
  AmortizationStatusReservationRecord,
  Reservation,
  ReservationStatusEnum,
  ReservationStatusRecord,
} from "../../prestation-sociale/models/cooperative-habitat/Reservation"
import { PersonTypeRecord } from "../../prestation-sociale/models/frais-obseques/personType"
import { ReasonRecord } from "../../prestation-sociale/models/idr/reason"
import { ApplicationIdrStatusEnumProperties } from "../../constant/applicationIdrStatus"
import { ExceptionalAssistanceAccount } from "../../admin/models/parametre"
import { OfferPaymentTrackingStatusRecord } from "../../prestation-sociale/models/cooperative-habitat/offer"
import { PenaltyNatureEnumRecord } from "../../prestation-sociale/models/cooperative-habitat/penalty-config"
import { ApplicationAdvanceFsStatusEnumProperties } from "../../constant/applicationAdvanceFsStatus"

@Component({
  selector: "generic-table",
  templateUrl: "./generic-table.component.html",
  styleUrls: ["./generic-table.component.scss"],
})
export class GenericTableComponent implements OnInit {
  protected readonly SiteTrackingStatusEnum = SiteTrackingStatusEnum
  protected readonly BuyerTypeRecord = BuyerTypeRecord
  protected readonly PhaseTypeRecord = PhaseTypeRecord
  protected readonly AmortizationStatusReservationRecord = AmortizationStatusReservationRecord
  protected readonly ReservationStatusRecord = ReservationStatusRecord
  readonly PersonTypeRecord = PersonTypeRecord
  readonly ReasonRecord = ReasonRecord
  readonly ApplicationIdrStatusEnumProperties = ApplicationIdrStatusEnumProperties
  readonly OfferPaymentTrackingStatusRecord = OfferPaymentTrackingStatusRecord
  readonly PenaltyNatureEnumRecord = PenaltyNatureEnumRecord
  readonly ApplicationAdvanceFsStatusEnumProperties = ApplicationAdvanceFsStatusEnumProperties

  // Outputs (Event handlerd)
  @Output() reloadTable = new EventEmitter()
  @Output() reloadInitialTable = new EventEmitter()
  @Output() memberPerPage = new EventEmitter()
  @Output() memberSearchPerPage = new EventEmitter()
  @Output() selectRow = new EventEmitter()
  @Output() unselectRow = new EventEmitter()
  @Output() selectedRow = new EventEmitter()
  @Output() actions = new EventEmitter()
  @Output() states = new EventEmitter()
  @Output() addCallBack = new EventEmitter()
  @Output() searchMulpliEvent = new EventEmitter()

  // Template ref
  @ContentChild("headerTemplate", { static: false })
  headerTemplateRef?: TemplateRef<any>
  @ContentChild("states")
  statesRef?: TemplateRef<any>
  @ContentChild("actions")
  actionsRef?: TemplateRef<any>
  @ContentChild("body")
  bodyRef?: TemplateRef<any>
  @ContentChild("rowexpansion")
  rowexpansionRef?: TemplateRef<any>
  @ViewChild("dt") dt: Table | undefined

  // Inputs
  _tableConfig = new MdsTableConfig()
  localeFr: LocaleSettings = Util.fr
  @Input()
  set tableConfig(tableConf: MdsTableConfig) {
    this._tableConfig = tableConf
    if (tableConf.initialShowDatas === true) {
      this.datas = this.allDatas
    }
  }

  @Input() totalRecords: any

  get tableConfig() {
    return this._tableConfig
  }

  @Input() datas: any[] = []
  @Input() allDatas: any[] = []
  @Input() cols?: MdsTableCols[]
  @Input() tableSearchLoad?: boolean

  // Simple variables
  rowSizes: any = RowSizes
  selected: any[] = []
  exportColumns?: any[]
  expandedRows = {}
  isExpanded = false

  // Loading display delay
  countDown: Subscription | undefined
  counter = 3
  tick = 1000
  data: any

  dataColumns = {
    listIncomplet: { url: "lists-dossier-incomplet", headersToHidden: ["Statut"] },
    listMutualist: { url: "mutualiste", headersToHidden: ["Statut"] },
    listAdhesion: { url: "adhesion", headersToHidden: ["Statut"] },
  }

  constructor(
    private table: GenericTableService,
    private primengConfig: PrimeNGConfig,
    public translateService: TranslateService,
    public routeService: RouteService,
  ) {
    translateService.use("fr")
    translateService.get("primeng").subscribe(res => this.primengConfig.setTranslation(res))
  }

  shouldHideHeadersBasedOnRoute(header: string): boolean {

    const theHeader = header.toLowerCase().trim()

    for (const keyList in this.dataColumns) {
      this.dataColumns[keyList].headersToHidden = this.dataColumns[keyList].headersToHidden.map((elt: string) => elt.toLowerCase().trim())

      if (
        this.isCurrentRoute(this.dataColumns[keyList].url)
        &&
        this.dataColumns[keyList].headersToHidden.includes(theHeader)
      ) return true
    }
    return false
  }

  isCurrentRoute(url: string): boolean {
    return this.routeService.currentUrl.value == "/" + url
  }

  ngOnInit(): void {
    this.exportColumns = this.cols?.map(col => ({ title: col.header, dataKey: col.field }))
  }

  onUnselect(event: any) {
    this.unselectRow.emit(event)
  }

  reload() {
    this.dt?.reset()
    this.reloadTable.emit()
    this.tableConfig.loading = true

    // Loading display countdown
    this.countDown = timer(0, this.tick).subscribe(() => {
      this.counter > 0 ? --this.counter : null
      if (this.counter === 0) {
        this.tableConfig.loading = false
        this.countDown?.unsubscribe()
      }
    })
    // stop ticker

    // Reinitialize counter for later use again
    this.counter = 3
  }

  excel() {
    this.table.toExcel(this.datas)
  }

  showValues(data: any) {
    console.log("Valeur", data)
  }

  getBorderClass(data:any, col:any):{title:string,className:string,icon:string}{
    const status = data[col?.field];
    let result = { title: '', className: '', icon: '' };

    switch (status) {
      case 'CREATED':
        result = { title: 'Cotisation Enregistrée', className: 'border-success', icon: 'pi pi-check-circle' };
        break;
      case 'NOT_CREATED':
        result = { title: 'Erreur', className: 'border-danger', icon: 'pi pi-times-circle' };
        break;
      case 'EXISTING':
        result = { title: 'Cotisation Déjà enregistrée', className: 'border-warning', icon: 'pi pi-exclamation-triangle' };
        break;
    }

    return result;
  }

  getParcelsProperties(parcelProperties: ParcelProperty[]): ParcelProperty[]{
    return ProjectUtil.sortListParcelProperties(parcelProperties)
  }

  getParcelPropertyIcon(siteParcelProperty: SiteParcelPropertyEnum): { icon: string, label: string }{
    return ProjectUtil.getParcelPropertyIcon(siteParcelProperty)
  }

  getStatusOfferTitle(status:string):string{
    if (status === 'PENDING') {
      return "En attente"
    }
    if (status === 'ACCEPTED') {
      return "Validée"
    }
    if (status === 'SUSPENDED') {
      return "Refusée"
    }
    return ""
  }

  getStatusReservation(data: Reservation): { name: keyof typeof ReservationStatusEnum ; value: string } {
    return ProjectUtil.getStatusReservation(data)
  }

  getStatusParamSecousTitle(data: ExceptionalAssistanceAccount):string{
    console.log('da',data,)
    if (data.stated) {
      return "Actif"
    }
    return "Inactif"
  }

  reloadTables() {
    this.dt?.reset()
    this.reloadInitialTable.emit({ state: true })
    this.tableConfig.loading = true
    this.tableConfig.searchMultiples.forEach(el => {
      el.value = ""
    })

    // Loading display countdown
    this.countDown = timer(0, this.tick).subscribe(() => {
      this.counter > 0 ? --this.counter : null
      if (this.counter === 0) {
        this.tableConfig.loading = false
        this.countDown?.unsubscribe()
      }
    })
    // stop ticker

    // Reinitialize counter for later use again
    this.counter = 2
  }

  searchMultiple() {
    this.dt?.reset()
    this.searchMulpliEvent.emit({ payload: this.tableConfig.searchMultiples, state: true })
  }

  onPageIndexChange(pageIndex: number | null) {
    if (this.tableSearchLoad) {
      this.searchMulpliEvent.emit({
        event: pageIndex,
        payload: this.tableConfig.searchMultiples,
        state: this.tableSearchLoad,
      })
    }

    this.memberPerPage.emit(pageIndex)
  }

  actionCallback(action: MdsTableAction, item: any) {
    this.actions.emit([action.callback, item])
  }

  stateCallback(state: MdsTableAction, item: any) {
    this.states.emit([state.callback, item])
  }

  add() {
    this.addCallBack.emit(true)
  }

  saveAmortization() {
    this.addCallBack.emit(true)
  }

  onRowExpand() {
    if (Object.keys(this.expandedRows).length === this.datas?.length) {
      this.isExpanded = true
    }
  }

  onRowCollapse() {
    if (Object.keys(this.expandedRows).length === 0) {
      this.isExpanded = false
    }
  }

  onSelect(event: any) {
    this.selectRow.emit(event)
  }

  getSelectedRow() {
    this.selectedRow.emit(this.selected)
  }

  searchEventMethode(keyWord: any) {
    if (keyWord) {
      this.datas = this.allDatas
    } else {
      this.datas = []
    }
  }

  closeAll() {
    this.expandedRows = {}
    this.isExpanded = false
  }


  pdf() {
    this.table.toPdf(this.exportColumns, this.datas)
  }

}
