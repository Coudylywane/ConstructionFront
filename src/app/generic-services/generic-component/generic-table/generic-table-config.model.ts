import { MdsTableAction, SearchMultipleModel } from "./generic-table-action.model"

export class MdsTableConfig {
  header?: boolean
  title?: string
  titleTooltip?: string
  key?: string
  dataKey?: string
  paginationRow?: number
  searchBarField?: any[]
  addBtnTitle?: string
  saveBtnTitle?: string
  actions?: MdsTableAction[] = []
  states?: MdsTableAction[] = []
  customData?: any
  loading?: boolean
  enableReload?: boolean
  enableMultiSearch?: boolean
  addBtn?: boolean
  addBtnImport?: boolean
  saveBtn?: boolean
  enablePagination?: boolean
  enableSearchBar?: boolean
  searchMultiples?: SearchMultipleModel[] = []
  enableExport?: boolean
  selectByCheckBox?: boolean
  selectByRadio?: boolean
  rowSelect?: boolean
  displayAction?: boolean
  displayState?: boolean
  expandable?: boolean
  extraFilter?: boolean
  initialShowDatas?: boolean
  transparentOrPrimaryBackground?: "primary" | "transparent" = "primary"

  constructor(obj: any = {}) {
    this.header = obj.header ?? true
    this.title = obj.title
    this.titleTooltip = obj.titleTooltip
    this.loading = obj.loading
    this.selectByCheckBox = obj.selectByCheckBox
    this.selectByRadio = obj.selectByRadio
    this.rowSelect = obj.rowSelect
    this.key = obj.key
    this.dataKey = obj.dataKey
    this.displayAction = obj.displayAction
    this.displayState = obj.displayState
    this.paginationRow = obj.paginationRow
    this.enablePagination = obj.enablePagination ?? true
    this.enableSearchBar = obj.enableSearchBar ?? true
    this.enableMultiSearch = obj.enableMultiSearch ?? false
    this.searchMultiples = obj.searchMultiples
    this.enableExport = obj.enableExport
    this.searchBarField = obj.searchBarField
    this.enableReload = obj.enableReload
    this.addBtn = obj.addBtn
    this.addBtnTitle = obj.addBtnTitle
    this.addBtnImport = obj.addBtnImport
    this.saveBtn = obj.saveBtn
    this.saveBtnTitle = obj.saveBtnTitle
    this.actions = obj.actions
    this.states = obj.states
    this.customData = obj.customData
    this.expandable = obj.expandable
    this.extraFilter = obj.extraFilter
    this.initialShowDatas = obj.initialShowDatas ?? true
    this.transparentOrPrimaryBackground = obj.transparentOrPrimaryBackground ?? "primary"
  }
}
