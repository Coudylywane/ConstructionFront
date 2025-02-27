import { Component, OnInit, ViewChild } from "@angular/core"
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog"
import { StatusContribution } from "../../cessions-cotisations/models/status"
import { InsuranceCompany, Month, Source, Trimester, Util } from "../../util/util"
import { ContributionTypeEnum } from "../../cessions-cotisations/models/Contribution"
import { UploadExcelFileService } from "../../cessions-cotisations/services/upload-excel-file.service"
import { Router } from "@angular/router"

@Component({
  selector: "app-upload-excel-file-insurance",
  templateUrl: "./upload-excel-file-insurance.component.html",
  styleUrls: ["./upload-excel-file-insurance.component.scss"],
  providers: [UploadExcelFileService],
})
export class UploadExcelFileInsuranceComponent implements OnInit {

  selectedSource: Source
  selectedCompany: InsuranceCompany
  selectedMonth: Month
  selectedTrimester: Trimester
  selectedYear: Date
  fileName: string

  uploadProgress = 0
  fileUploaded: File
  hasUploadedFile: boolean
  data: FormData = new FormData()
  date: Date
  @ViewChild("fileInput") fileInput: any

  sources: Source[] = Util.getSources()
  companies: InsuranceCompany[] = Util.getCompanies()
  months: Month[] = Util.getMonths()
  trimesters: Trimester[] = Util.getTrimesters()


  res = ""
  status = ""
  text = ""
  loading = false
  buttonLabel = "Enregistrer"
  buttonIcon = "pi pi-save"
  class = "btn btn-success pull-right"

  constructor(
    private uploadExcelFileService: UploadExcelFileService,
    public config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private route: Router,
  ) {
  }

  ngOnInit() {
    this.uploadProgress = 0
  }

  reset() {
    this.hasUploadedFile = false
    this.fileInput.nativeElement.value = ""
    this.uploadProgress = 0
    this.text = ""
    this.status = ""
    this.res = ""
    this.fileUploaded = null
  }

  uploadFile() {
    this.text = ""
    this.buttonStateWhenUploading()
    const formData = new FormData()
    formData.append("documentType", this.selectedSource.value)
    formData.append("documentName", this.config.data.typeCotisation)
    formData.append("file", this.fileUploaded)
    formData.append("year", this.selectedYear.getFullYear().toString())
    formData.append("company", this.selectedCompany.name)

    if (this.selectedSource.value === ContributionTypeEnum.TSC.value) {
      formData.append("month", this.selectedMonth.code.toString())
    } else if (
      this.selectedSource.value === ContributionTypeEnum.FC.value ||
      this.selectedSource.value === ContributionTypeEnum.PRIME_REDACTEUR.value
    ) {
      formData.append("trimester", this.selectedTrimester.code.toString())
    }
    this.uploadExcelFileService.uploadExcelInsuranceFile(formData).subscribe(res => {
      this.message(res)
    })
  }

  buttonInitialState() {
    this.buttonLabel = "Enregistrer"
    this.buttonIcon = "pi pi-save"
  }

  buttonStateWhenUploading() {
    this.buttonLabel = "Enregistrement en cours..."
    this.buttonIcon = "pi pi-spin pi-spinner"
  }

  message(res) {
    this.res = res
    if (res.status === StatusContribution.FAILED) {
      this.status = res.status
      this.text = "Votre fichier contient des erreurs!"
    } else if (res.status === StatusContribution.SUCCESS) {
      this.status = res.status
      this.text = "Chargement réussi!"
    }
    this.buttonInitialState()
  }


  onFileSelected(event: any) {
    this.fileUploaded = event.target.files[0]
    this.hasUploadedFile = true
    this.fileName = this.fileUploaded.name
  }

  history(res) {
    this.ref.close()
    this.route.navigate(["/history-details", res])
  }
}
