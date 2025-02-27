export enum MdsActionType {
  "start",
  "view",
  "edit",
  "open",
  "delete",
  "reset",
  "archive",
  "validated",
  "rejected",
  "pending",
  "treat",
  "treat_mise_a_jour",
  "genererCheque",
  "viewDetails",
  "viewInfo",
  "enabled",
  "incomplete",
  "viewMore",
  "traiter",
  "generer",
  "chargerBLouPV",
  "corriger",
  "viewDocument",
  "signeProtocole",
  "validatApplication",
  "generatePV",

  "cancel",
  "generateAmortization",
  "chargerBonLivraison",
  "transmettreDPL",
}

export class MdsTableAction {
  type: any = MdsActionType
  mini?: boolean
  callback: any

  constructor(obj: any = {}) {
    this.type = obj.type
    this.mini = obj.mini ?? true
    this.callback = obj.callback
  }
}

export class SearchMultipleModel {
  label?: string
  name?: string
  type?: string
  value?: string
  array?: ArrayDropdown[] = []
  calendar?: Calendar
  selected?: any
  constructor(obj: any = {}) {
    this.label = obj.label
    this.name = obj.name
    this.type = obj.type
    this.value = obj.value
    this.array = obj.array
    this.calendar = obj.calendar
    this.selected = obj.selected
  }
}

export class ArrayDropdown {
  name?: string
  value?:string

  constructor(obj: any = {}) {
    this.name = obj.name
    this.value = obj.value
  }
}

export class Calendar {
  dateFormat?: string
  view?: string
  date: Date
  constructor(obj: any = {}) {
    this.dateFormat = obj.dateFormat
    this.view = obj.view
    this.date = obj.date
  }
}
