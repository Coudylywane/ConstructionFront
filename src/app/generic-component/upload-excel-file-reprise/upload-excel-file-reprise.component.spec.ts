import { ComponentFixture, TestBed } from "@angular/core/testing"
import { UploadExcelFileRepriseComponent } from "./upload-excel-file-reprise.component"
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog"
import { BreadcrumbService } from "../../../core/breadcrumb/breadcrumb.service"
import { ConfigService } from "../../../demo/service/app.config.service"
import { HttpClient, HttpHandler } from "@angular/common/http"
import { ContributionService } from "../../cessions-cotisations/services/contribution.service"
import { GenericDialogConfig } from "../generic-dialog/generic-dialog-config.model"
import { Router } from "@angular/router"
import { StatusContribution } from "../../cessions-cotisations/models/status"
import { UploadExcelFileService } from "../../cessions-cotisations/services/upload-excel-file.service"
import { LoadHistory } from "../../cessions-cotisations/models/LoadHistory"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { ContributionTypeEnum } from "../../cessions-cotisations/models/Contribution"
import { of } from "rxjs"
import { KeycloakService } from "keycloak-angular"

const mockResponse = { message: "File uploaded successfully" }
const fileUploaded = new File(["dummy content"], "dummy.xlsx", {
  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
})
const month = 4
const formData = new FormData()
formData.append("source", "TSC")
formData.append("contributionType", "SOLIDARITY_FUND_CONTRIBUTION")
formData.append("file", fileUploaded)
formData.append("month", month.toString())
formData.append("dateImport", new Date().toISOString())

// Mock uploadExcelFileService.uploadExcelFile method
const loadHistory: Partial<LoadHistory> = {
  loadHistoryID: "string",
  createdAt: new Date("13-05-2020"),
  fileName: "string",
  source: "string",
  status: 'SUCCESS',
}

describe("UploadExcelFileRepriseComponent", () => {
  let component: UploadExcelFileRepriseComponent
  let fixture: ComponentFixture<UploadExcelFileRepriseComponent>
  let uploadExcelFileService: UploadExcelFileService
  let config: DynamicDialogConfig

  let keycloakService: KeycloakService
  const keycloakServiceMock = {
    getUsername: jest.fn().mockReturnValue("username"),
    getUserRoles: jest.fn().mockReturnValue(["CMS", "SE", "GCC"]),
  }

  const uploadExcelFileMock = {
    uploadExcelFile: jest.fn(),
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UploadExcelFileRepriseComponent],
      providers: [
        BreadcrumbService,
        ConfigService,
        HttpClient,
        HttpHandler,
        { provide: Router, useValue: {navigate: jest.fn()}, },
        { provide: KeycloakService, useValue: keycloakServiceMock },

        ContributionService,
        GenericDialogConfig,
        DialogService,
        DynamicDialogRef,
        UploadExcelFileService,
        DynamicDialogConfig,
        {
          provide: DynamicDialogConfig,
          useValue: { data: { application: "Test Application", notification: "Test Notification" } },
        },
      ],
    }).compileComponents()

    keycloakService = TestBed.inject(KeycloakService)
    uploadExcelFileService = TestBed.inject(UploadExcelFileService) // Inject the service
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadExcelFileRepriseComponent)
    component = fixture.componentInstance
    keycloakService["_userProfile"] = "username"
    fixture.detectChanges()
    component["uploadExcelFileService"] = uploadExcelFileMock as any
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should initialize application and notification from DynamicDialogConfig", () => {
    expect(component.application).toEqual("Test Application")
    expect(component.notification).toEqual("Test Notification")
  })

  it("should handle file selection correctly", () => {
    // Create a mock File object
    const file = new File(["dummy content"], "dummy.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })

    // Create a mock event object with a file array
    const event = {
      target: {
        files: [file],
      },
    }

    // Call the onFileSelected method with the mock event
    component.onFileSelected(event)

    // Assert that the fileUploaded property is correctly assigned
    expect(component.fileUploaded).toBe(file)

    // Assert that hasUploadedFile is set to true
    expect(component.hasUploadedFile).toBe(true)
  })

  it("should reset file input correctly", () => {
    // Set initial values for the properties
    component.hasUploadedFile = true
    component.fileInput.nativeElement.value = ""
    component.uploadProgress = 0
    component.text = ""
    component.status = ""
    component.res = ""
    component.fileUploaded = null

    // Call the resetFileInput method
    component.resetFileInput()

    // Assert that the properties are correctly reset
    expect(component.hasUploadedFile).toBe(false)
    expect(component.fileInput.nativeElement.value).toBe("")
    expect(component.uploadProgress).toBe(0)
    expect(component.text).toBe("")
    expect(component.status).toBe("")
    expect(component.res).toBe("")
    expect(component.fileUploaded).toBeNull()
  })

  it("should set button label and icon to initial state", () => {
    // Call the buttonInitialState method
    component.buttonInitialState()

    // Assert that the buttonLabel and buttonIcon properties are set to their initial values
    expect(component.buttonLabel).toBe("Enregistrer")
    expect(component.buttonIcon).toBe("pi pi-save")
  })

  it("should set button label and icon when uploading", () => {
    // Call the buttonStateWhenUploading method
    component.buttonStateWhenUploading()

    // Assert that the buttonLabel and buttonIcon properties are set to the correct values
    expect(component.buttonLabel).toBe("Enregistrement en cours...")
    expect(component.buttonIcon).toBe("pi pi-spin pi-spinner")
  })

  it("should display error message when status is FAILED", () => {
    const res = { status: StatusContribution.FAILED }

    // Call the messageToDisplay method with the mock response
    component.messageToDisplay(res)

    // Assert that the status and text properties are set correctly
    expect(component.status).toBe(StatusContribution.FAILED)
    expect(component.text).toBe("Votre fichier contient des erreurs!")
  })

  it("should display success message when status is SUCCESS", () => {
    const res = { status: StatusContribution.SUCCESS }

    // Call the messageToDisplay method with the mock response
    component.messageToDisplay(res)

    // Assert that the status and text properties are set correctly
    expect(component.status).toBe(StatusContribution.SUCCESS)
    expect(component.text).toBe("Chargement réussi!")
  })

  it("should call buttonInitialState after setting message", () => {
    // Mock the buttonInitialState method
    const buttonInitialStateSpy = jest.spyOn(component, "buttonInitialState")

    const res = { status: StatusContribution.SUCCESS }

    // Call the messageToDisplay method with the mock response
    component.messageToDisplay(res)

    // Assert that the buttonInitialState method is called
    expect(buttonInitialStateSpy).toHaveBeenCalled()
  })


  it("should close the dialog and navigate to history details on successful upload", () => {
    // Arrange
    const refMock = { close: jest.fn() } // Mock the DynamicDialogRef
    const routeMock = { navigate: jest.fn() } // Mock the Router
    component["ref"] = refMock as any // Assign the mock ref
    component["route"] = routeMock as any // Assign the mock route
    const successResponse = { status: StatusContribution.SUCCESS }

    // Act
    component.goToHistory(successResponse)

    // Assert
    expect(refMock.close).toHaveBeenCalled() // Verify dialog is closed
    expect(routeMock.navigate).toHaveBeenCalledWith(["/history-details", successResponse]) // Verify navigation with response data
  })

  it("should upload file and display success message on successful upload TSC", () => {
    // Arrange
    const formDataSpy = new FormData() // Mock FormData
    const uploadExcelFileServiceMock = { uploadExcelFile: jest.fn().mockReturnValue(of(mockResponse)) } // Mock service and return successful response
    const messageToDisplaySpy = jest.spyOn(component, "messageToDisplay") // Spy on messageToDisplay method

    component.source = ContributionTypeEnum.TSC.value // Set source type (example)
    component["config"] = { data: { typeCotisation: "SOLIDARITY_FUND_CONTRIBUTION" } } // Set config data
    component.fileUploaded = fileUploaded // Set uploaded file
    component.selectedMonth = { name: "Janvier", code: 1 } // Set selected month (example)
    component.date = new Date() // Set date
    component["uploadExcelFileService"] = uploadExcelFileServiceMock as any // Assign mock service

    // Act
    component.uploadFile()
    expect(messageToDisplaySpy).toHaveBeenCalledWith(mockResponse) // Verify messageToDisplay called with response
  })

  it("should upload file and display success message on successful upload FC", () => {
    // Arrange
    const formDataSpy = new FormData() // Mock FormData
    const uploadExcelFileServiceMock = { uploadExcelFile: jest.fn().mockReturnValue(of(mockResponse)) } // Mock service and return successful response
    const messageToDisplaySpy = jest.spyOn(component, "messageToDisplay") // Spy on messageToDisplay method

    component.source = ContributionTypeEnum.FC.value // Set source type (example)
    component["config"] = { data: { typeCotisation: "SOLIDARITY_FUND_CONTRIBUTION" } } // Set config data
    component.fileUploaded = fileUploaded // Set uploaded file
    component.selectedTrimester = { name: "Janvier - Février - Mars", code: 1 }
    component.date = new Date()
    component["uploadExcelFileService"] = uploadExcelFileServiceMock as any // Assign mock service

    // Act
    component.uploadFile()
    expect(messageToDisplaySpy).toHaveBeenCalledWith(mockResponse) // Verify messageToDisplay called with response
  })


  it("should upload file and display success message on successful upload PR", () => {
    // Arrange
    const uploadExcelFileServiceMock = { uploadExcelFile: jest.fn().mockReturnValue(of(mockResponse)) } // Mock service and return successful response
    const messageToDisplaySpy = jest.spyOn(component, "messageToDisplay") // Spy on messageToDisplay method

    component.source = ContributionTypeEnum.PRIME_REDACTEUR.value // Set source type (example)
    component.fileUploaded = fileUploaded // Set uploaded file
    component["config"] = { data: { typeCotisation: "SOLIDARITY_FUND_CONTRIBUTION" } }
    component.selectedTrimester = { name: "Janvier - Février - Mars", code: 1 }
    component.date = new Date()
    component["uploadExcelFileService"] = uploadExcelFileServiceMock as any // Assign mock service

    component.uploadFile()
    expect(messageToDisplaySpy).toHaveBeenCalledWith(mockResponse) // Verify messageToDisplay called with response
  })

})
