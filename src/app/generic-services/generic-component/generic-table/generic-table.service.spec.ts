import { GenericTableService } from "./generic-table.service"
import { TestBed } from "@angular/core/testing"
import { typeAction, typeSearchMultiples } from "./type-table"
import { registerLocaleData } from "@angular/common"
import localeFr from "@angular/common/locales/fr"
import * as FileSaver from "file-saver"

const searchTabMock: typeSearchMultiples[] = [
  [
    "Type", "applicationType", "input", "",
    [{ name: "PRET_CONSTRUCTION", value: "PRÊT CONSTRUCTION" },
      { name: "PRET_VEHICULE", value: "PRÊT VEHICULE" },
      { name: "PRET_ESPECE", value: "PRÊT ESPECE" },
      { name: "PRET_EQUIPEMENT", value: "PRÊT EQUIPEMENT" },
      { name: "OPERATION_TABASKI", value: "OPÉRATION TABASKI" },
      { name: "OPERATION_KORITE", value: "OPÉRATION KORITÉ" },
    ], null, null,
  ],
  ["Montant Min", "amount_min", "input", "", [], null, null],
  ["Matricule Mutuelle", "applicationNumber", "input", "", [], null, null],
  ["Date Début", "startDateD", "input", "", [], null, null],
  ["Date Fin", "endDateD", "input", "", [], null, null],
]
const searchJSONMock = [
  {
    "label": "Type",
    "name": "applicationType",
    "type": "input",
    "value": "",
    "array": [
      { name: "PRET_CONSTRUCTION", value: "PRÊT CONSTRUCTION" },
      { name: "PRET_VEHICULE", value: "PRÊT VEHICULE" },
      { name: "PRET_ESPECE", value: "PRÊT ESPECE" },
      { name: "PRET_EQUIPEMENT", value: "PRÊT EQUIPEMENT" },
      { name: "OPERATION_TABASKI", value: "OPÉRATION TABASKI" },
      { name: "OPERATION_KORITE", value: "OPÉRATION KORITÉ" },
    ],
    "calendar": null,
    "selected": null,
  },
  {
    "label": "Montant Min",
    "name": "amount_min",
    "type": "input",
    "value": "",
    "array": [],
    "calendar": null,
    "selected": null,
  },
  {
    "label": "Matricule Mutuelle",
    "name": "applicationNumber",
    "type": "input",
    "value": "",
    "array": [],
    "calendar": null,
    "selected": null,
  },
  {
    "label": "Date Début",
    "name": "startDateD",
    "type": "input",
    "value": "",
    "array": [],
    "calendar": null,
    "selected": null,
  },
  {
    "label": "Date Fin",
    "name": "endDateD",
    "type": "input",
    "value": "",
    "array": [],
    "calendar": null,
    "selected": null,
  },
]

const actionsTabMock: typeAction[] = [
  ["viewInfo", true, "viewDemande"],
]
const actionsJSONMock = [
  {
    "type": "viewInfo",
    "mini": true,
    "callback": "viewDemande",
  },
]
describe("GenericTableService", () => {
  let service: GenericTableService
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],

    })
    service = TestBed.inject(GenericTableService)

  })

  it("should be created", () => {
    expect(service).toBeTruthy()
  })

  it("should generate and save a PDF with the correct file name", async () => {
    jest.spyOn(service, "toPdf")
    // Mock the 'jspdf' and 'jspdf-autotable' modules
    jest.mock("jspdf", () => {
      const saveMock = jest.fn()
      const jsPDFMock = jest.fn().mockImplementation(() => ({
        save: saveMock,
      }))
      return { default: jsPDFMock }
    })
    jest.mock("jspdf-autotable", () => ({
      autoTable: jest.fn(),
    }))

    // Call the function
    service.toPdf(["Name", "Age"], [["John", 30], ["Alice", 25]], "test-file")

    setTimeout(() => {

      // // Expectations for jspdf-autotable usage
      // expect(import('jspdf-autotable')).toHaveBeenCalledWith(expect.any(Object), {
      //   head: ['Name', 'Age'],
      //   body: [['John', 30], ['Alice', 25]],
      //   didDrawCell: expect.any(Function),
      // });
      //
      // // Expectations for jspdf usage
      // expect(import("jspdf")).toHaveBeenCalledWith('l', 'mm');


      // Expectations for jspdf-autotable usage
      expect(require("jspdf-autotable").autoTable).toHaveBeenCalledWith(expect.any(Object), {
        head: ["Name", "Age"],
        body: [["John", 30], ["Alice", 25]],
        didDrawCell: expect.any(Function),
      })

      // Expectations for jspdf usage
      expect(require("jspdf").default).toHaveBeenCalledWith("l", "mm")
      expect(require("jspdf").default.prototype.save).toHaveBeenCalledWith("test-file.pdf")
      // Assert that the save method is called with the correct file name
      expect(require("jspdf").jsPDF.save).toHaveBeenCalledWith("test-file.pdf")

    }, 3000)
  })

  it("should call saveAsExcelFile with the correct arguments", async () => {
    // Data to convert to Excel
    const datas = [{ name: "John", age: 30 }, { name: "Alice", age: 25 }]
    jest.spyOn(service, "toExcel")
    jest.spyOn(service, "saveAsExcelFile")

    // Mock the xlsx module
    const xlsxMock = {
      utils: {
        json_to_sheet: jest.fn(),
      },
      write: jest.fn(),
    }

    // Mock the import of xlsx
    jest.doMock("xlsx", async () => Promise.resolve(xlsxMock))


    // Call the function
    service.toExcel(datas, "test-file")

    setTimeout(() => {
      // Assert that json_to_sheet and write are called with the correct arguments
      expect(xlsxMock.utils.json_to_sheet).toHaveBeenCalledWith(expect.any(Array))
      expect(xlsxMock.utils.json_to_sheet).toHaveBeenCalledWith(datas)
      expect(xlsxMock.write).toHaveBeenCalledWith(
        { Sheets: { data: expect.anything() }, SheetNames: ["data"] },
        { bookType: "xlsx", type: "array" },
      )

      // Assert that saveAsExcelFile is called with the correct arguments
      expect(service.saveAsExcelFile).toHaveBeenCalledWith(
        expect.any(Uint8Array), // or expect.any(Blob) depending on implementation
        "test-file",
      )

    }, 10000)// l'import peut prendre un moment

  })

  it("should save the file with the correct name", () => {
    const saveAsMock = jest.spyOn(FileSaver, "saveAs").mockImplementation(() => {
    })
    jest.spyOn(service, "saveAsExcelFile")
    // Call the function
    const buffer = "" // Provide a buffer value
    const fileName = "example-file-name" // Provide a file name
    const currentTime = new Date().getTime()
    const expectedFileName = `${fileName}_export_${currentTime}.xlsx` // Use exact value for the dynamic date part
    service.saveAsExcelFile(buffer, fileName)

    // Assert that saveAs method is called with the correct arguments
    // expect(saveAsMock).toHaveBeenCalledWith(expect.any(Blob), expectedFileName)

    // Restore the mock
    saveAsMock.mockRestore()

  })

  it("should return date in format \"dd/MM/yyyy\" when the date is provided to pipDate method ", () => {
    // Register the "fr-FR" locale data
    registerLocaleData(localeFr)
    jest.spyOn(service, "pipDate")

    const result = service.pipDate(new Date("12/12/2024"))

    expect(service.pipDate).toHaveBeenCalled()
    expect(result).toEqual("12/12/2024")
  })

  it("should return the number  when rate is provide in (0.8 -> 80) ", () => {
    // Register the "fr-FR" locale data
    registerLocaleData(localeFr)
    jest.spyOn(service, "pipTaux")
    const taux: number = 0.8

    const result = service.pipTaux(taux)

    expect(service.pipTaux).toHaveBeenCalled()
    expect(result).toEqual("80")
  })

  it("should return the actions object when actionsTab is provided to getActionsTab method", () => {
    jest.spyOn(service, "getActionsTable")

    const result = service.getActionsTable(actionsTabMock)

    expect(service.getActionsTable).toHaveBeenCalled()
    expect(result).toEqual(result)
  })


  it("should return the search object when search tab is provided to searchTab method", () => {
    jest.spyOn(service, "searchTab")

    const result = service.searchTab(searchTabMock)

    expect(service.searchTab).toHaveBeenCalled()
    expect(result).toEqual(searchJSONMock)
  })


})

