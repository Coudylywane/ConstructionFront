import { MdsColType } from "./generic-table-cols.model"
import { MdsActionType } from "./generic-table-action.model"

export type typeAction = [/* type */ keyof typeof MdsActionType, /* mini */ boolean, /* callback */ string]
export type typeSearchMultiples = [
  /* label */ string,
  /* name */ string,
  /* type */ string | null,
  /* value */ string | null,
  /* array */ { name: string, value: string }[] | null,
  /* calendar */ {
    date: Date | null,
    dateFormat: string,
    view: string
  } | null,
  /* selected */ null | true | false]

enum WidthTable {
  inherit = "inherit",
  "5%" = "5%",
  "10%" = "10%",
  "15%" = "15%",
  "17%" = "17%",
  "20%" = "20%",
  "25%" = "25%",
  "35%" = "35%",
  "50%" = "50%",
  "60%" = "60%",
  "75%" = "75%"
}

type typeWidth = keyof typeof WidthTable
export type typeColsTable = [
  /* field */ string,
  /* header */ string,
  /* sortable */ boolean,
  /* filterable */ boolean,
  /* type */   keyof typeof MdsColType,
  /* subField */ string?,
  /* width */ typeWidth?,
]

