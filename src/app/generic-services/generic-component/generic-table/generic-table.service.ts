import { Injectable } from "@angular/core"
import * as FileSaver from "file-saver"
import autoTable from "jspdf-autotable"
import { DatePipe, PercentPipe } from "@angular/common"
import { typeAction, typeColsTable, typeSearchMultiples } from "./type-table"
import { SearchMultipleModel } from "./generic-table-action.model"
import { MdsTableCols } from "./generic-table-cols.model"

@Injectable({
  providedIn: "root",
})
export class GenericTableService {
  toPdf(cols?: any[], datas?: any[], fileName = "file") {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default("l", "mm")
        autoTable(doc, {
          head: cols,
          body: datas,
          didDrawCell: data => {
          },
        })
        doc.save(fileName + ".pdf")
      })
    })
  }

  toExcel(datas: any[], fileName = "file") {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(datas)
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] }
      const excelBuffer: any = xlsx.write(workbook, { bookType: "xlsx", type: "array" })
      this.saveAsExcelFile(excelBuffer, fileName)
    })
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    const EXCEL_EXTENSION = ".xlsx"
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    })
    FileSaver.saveAs(data, fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION)
  }

  pipDate(date) {
    const datePipe = new DatePipe("fr-FR")
    return datePipe.transform(date, "dd/MM/yyyy")
  }

  pipTaux(taux: number): string {
    const percent = new PercentPipe("fr-FR")
    return percent.transform(taux).replace(/%/, "").trim()
  }

  getActionsTable(actions: typeAction[]) {
    const theActions: { type: string, mini: boolean, callback: any }[] = []
    for (const element of actions) {
      theActions.push({
        type: element[0],
        mini: element[1],
        callback: element[2],
      })
    }
    return theActions
  }

  getColsTable(colsTab: typeColsTable[]): MdsTableCols[] {
    const theColumns: MdsTableCols[] = []
    for (const element of colsTab) {
      const eltFact = {
        field: element[0],
        header: element[1],
        sortable: element[2],
        filterable: element[3],
        type: element[4],

      }
      if (element[5]) eltFact["subField"] = element[5]
      if (element[6]) eltFact["width"] = element[6]

      theColumns.push(eltFact)
    }
    return theColumns
  }

  searchTab(tab: typeSearchMultiples[]) {
    const theSearch: SearchMultipleModel[] = []
    for (const element of tab) {
      theSearch.push({
        label: element[0],
        name: element[1],
        type: element[2],
        value: element[3],
        array: element[4],
        calendar: element[5],
        selected: element[6],
      })
    }
    return theSearch
  }

  buildFormDataForMultipleSearch(payload: any): any {
    let formData: any = {}

    payload.forEach((elt: any) => {
      const value = this.getElementValue(elt);
      if (value !== undefined) {
        this.assignFormData(formData, elt, value);
      }
    });

    //  enlever toutes les espaces
    this.trimFormData(formData);

    return formData
  }


  getElementValue(elt: any): any {
    switch (elt.type) {
      case "input":
        return elt.value ? elt.value : "";
      case "dropdown":
        return elt.selected ? elt.selected.name : "";
      case "date":
        return this.getDateValue(elt.calendar);
      default:
        return '';
    }
  }

  assignFormData(formData: any, elt: any, value: any): void {
    if (elt.type === "date") {
      formData["month"] = value.month;
      formData["year"] = value.year;
    } else {
      formData[elt.name] = value;
    }
  }
  trimFormData(formData: any): void {
    Object.keys(formData).forEach(key => {
      if (typeof formData[key] === 'string') {
        formData[key] = formData[key].trim();
      }
    });
  }

  isFormDataForMultipleSearchEmpty(formData:any){
    if(!Object.keys(formData).length) return true
    for (const key in formData) {
      if (formData.hasOwnProperty(key) && formData[key] !== "") {
        return false
      }
    }
    return true

  }

  getDateValue(calendar: any): { month: string; year: string } | undefined {
    if (calendar.date != null) {
      const date = new Date(calendar.date)
      const month = (date.getMonth() + 1).toString()
      const year = date.getFullYear().toString()

      if (calendar.view === "year") {
        return { month: "", year }
      } else {
        return { month, year }
      }
    }

    return undefined
  }

  invokeComponentMethod(component: Object, event: any[]){
    const fnCallback = component[event[0]] as Function
    const arg = event[1]

    if(typeof fnCallback === 'function'){
      fnCallback.bind(component)(arg)
    }
  }

  reloadInitial(component: Object, defaultListCallbackName: string, event: any,){
    component['tableDefaultLoad'] = event.state
    component['tableSearchLoad'] = !event.state

    const fnCallback = component[defaultListCallbackName] as Function
    if(typeof fnCallback === 'function'){
      fnCallback.bind(component)()
    }
    component['tableConfig'].searchMultiples.forEach(el => {
      el.value = ""
      el.selected = ""
      el.calendar = { ...el.calendar, date: null }
    })
  }


}
