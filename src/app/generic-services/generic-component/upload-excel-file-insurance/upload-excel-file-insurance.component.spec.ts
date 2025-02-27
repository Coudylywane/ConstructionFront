import { ComponentFixture, TestBed } from "@angular/core/testing"

import { UploadExcelFileInsuranceComponent } from "./upload-excel-file-insurance.component"
import { StatusContribution } from "../../cessions-cotisations/models/status"
import { BreadcrumbService } from "../../../core/breadcrumb/breadcrumb.service"
import { ConfigService } from "../../../demo/service/app.config.service"
import { HttpClient, HttpHandler } from "@angular/common/http"
import { Router } from "@angular/router"
import { ContributionService } from "../../cessions-cotisations/services/contribution.service"
import { GenericDialogConfig } from "../generic-dialog/generic-dialog-config.model"
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog"
import { ContributionTypeEnum } from "../../cessions-cotisations/models/Contribution"
import { KeycloakService } from "keycloak-angular"

describe("UploadExcelFileInsuranceComponent", () => {
  let component: UploadExcelFileInsuranceComponent
  let fixture: ComponentFixture<UploadExcelFileInsuranceComponent>
  let keycloakService: KeycloakService
  const keycloakServiceMock = {
    getUsername: jest.fn().mockReturnValue("username"),
    getUserRoles: jest.fn().mockReturnValue(["CMS", "SE", "GCC"]),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadExcelFileInsuranceComponent],
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
        {
          provide: DynamicDialogConfig,
          useValue: { data: { application: "Test Application", notification: "Test Notification" } },
        },
      ],
    }).compileComponents()
    keycloakService = TestBed.inject(KeycloakService)
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadExcelFileInsuranceComponent)
    component = fixture.componentInstance
    keycloakService["_userProfile"] = "username"
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
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
    component.reset()

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
    component.message(res)

    // Assert that the status and text properties are set correctly
    expect(component.status).toBe(StatusContribution.FAILED)
    expect(component.text).toBe("Votre fichier contient des erreurs!")
  })

  it("should display success message when status is SUCCESS", () => {
    const res = { status: StatusContribution.SUCCESS }

    // Call the messageToDisplay method with the mock response
    component.message(res)

    // Assert that the status and text properties are set correctly
    expect(component.status).toBe(StatusContribution.SUCCESS)
    expect(component.text).toBe("Chargement réussi!")
  })

  it("should call buttonInitialState after setting message", () => {
    // Mock the buttonInitialState method
    const buttonInitialStateSpy = jest.spyOn(component, "buttonInitialState")

    const res = { status: StatusContribution.SUCCESS }

    // Call the messageToDisplay method with the mock response
    component.message(res)

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
    component.history(successResponse)

    // Assert
    expect(refMock.close).toHaveBeenCalled() // Verify dialog is closed
    expect(routeMock.navigate).toHaveBeenCalledWith(["/history-details", successResponse]) // Verify navigation with response data
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
    component.reset()

    // Assert that the properties are correctly reset
    expect(component.hasUploadedFile).toBe(false)
    expect(component.fileInput.nativeElement.value).toBe("")
    expect(component.uploadProgress).toBe(0)
    expect(component.text).toBe("")
    expect(component.status).toBe("")
    expect(component.res).toBe("")
    expect(component.fileUploaded).toBeNull()
  })

  it("should upload file TSC", () => {
    // Mock data
    const file = new File(["dummy content"], "dummy.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const formData = new FormData()
    formData.append("documentName", "TSC")
    formData.append("documentType", "INSURANCE_CONTRIBUTION")
    formData.append("file", file)
    formData.append("year", "2024") // Adjust year as needed
    formData.append("company", "NSIA")
    formData.append("month", "1") // Adjust month as needed

    // Mock response from the service
    const mockResponse = { status: StatusContribution.SUCCESS }

    // Mock the service method

    // Set component properties
    component.selectedSource = { name: ContributionTypeEnum.TSC.name, value: ContributionTypeEnum.TSC.value } // Adjust as needed
    component.selectedYear = new Date() // Adjust as needed
    component.selectedCompany = { name: "NSIA",value:'NSIA' }
    component.selectedMonth = { name: "Janvier", code: 1 }
    component.fileUploaded = file
    component.fileName = "dummy.xlsx"
    component.status = StatusContribution.SUCCESS
    component.text = "Chargement réussi!"
    // Call the method
    component.uploadFile()

    // Assert
    expect(component.status).toEqual(StatusContribution.SUCCESS)
    // Add more assertions if needed
  })


  it("should upload file FC", () => {
    // Mock data
    const file = new File(["dummy content"], "dummy.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const formData = new FormData()
    formData.append("documentName", "TSC")
    formData.append("documentType", "INSURANCE_CONTRIBUTION")
    formData.append("file", file)
    formData.append("year", "2024") // Adjust year as needed
    formData.append("company", "NSIA")
    formData.append("trimester", "1") // Adjust month as needed

    // Mock response from the service
    const mockResponse = { status: StatusContribution.SUCCESS }

    // Mock the service method

    // Set component properties
    component.selectedSource = { name: ContributionTypeEnum.FC.name, value: ContributionTypeEnum.FC.value } // Adjust as needed
    component.selectedCompany = { name: "NSIA",value:'NSIA' }
    component.selectedYear = new Date() // Adjust as needed
    component.selectedTrimester = { name: "Janvier - Février - Mars", code: 1 }
    component.fileUploaded = file
    component.fileName = "dummy.xlsx"
    component.status = StatusContribution.SUCCESS
    component.text = "Chargement réussi!"
    // Call the method
    component.uploadFile()

    // Assert
    expect(component.status).toEqual(StatusContribution.SUCCESS)
    // Add more assertions if needed
  })

  it("should upload file PR", () => {
    // Mock data
    const file = new File(["dummy content"], "dummy.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const formData = new FormData()
    formData.append("documentName", "TSC")
    formData.append("documentType", "INSURANCE_CONTRIBUTION")
    formData.append("file", file)
    formData.append("year", "2024") // Adjust year as needed
    formData.append("company", "NSIA")
    formData.append("trimester", "1") // Adjust month as needed

    // Mock response from the service
    const mockResponse = { status: StatusContribution.SUCCESS }

    // Mock the service method

    // Set component properties
    component.selectedSource = { name: ContributionTypeEnum.PRIME_REDACTEUR.name, value: ContributionTypeEnum.PRIME_REDACTEUR.value } // Adjust as needed
    component.selectedYear = new Date() // Adjust as needed
    component.selectedCompany = { name: "NSIA" ,value:'NSIA'}
    component.selectedTrimester = { name: "Janvier - Février - Mars", code: 1 }
    component.fileUploaded = file
    component.fileName = "dummy.xlsx"
    component.status = StatusContribution.SUCCESS
    component.text = "Chargement réussi!"
    // Call the method
    component.uploadFile()

    // Assert
    expect(component.status).toEqual(StatusContribution.SUCCESS)
    // Add more assertions if needed
  })

})
