import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core"
import { RowSizes } from "../../generic-model/rowSize"
import { User } from "../../prestation-sociale/models/user"
import { Supplier } from "../../prestation-sociale/models/supplier"
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog"
import { ConfigService } from "../../../demo/service/app.config.service"
import { Router } from "@angular/router"
import { ContributionTypeEnum } from "../../cessions-cotisations/models/Contribution"
import { StatusContribution } from "../../cessions-cotisations/models/status"
import { UploadExcelFileService } from "../../cessions-cotisations/services/upload-excel-file.service"
import { Month, Trimester, Util } from "../../util/util"

@Component({
  selector: "app-upload-excel-file-reprise",
  templateUrl: "./upload-excel-file-reprise.component.html",
  styleUrls: ["./upload-excel-file-reprise.component.scss"],
  providers: [UploadExcelFileService],
})
export class UploadExcelFileRepriseComponent implements OnInit {
  @Output() notification = new EventEmitter<any>()
  rowSizes: any = RowSizes
  totalRecords: number
  user: User = new User()
  items: any[] = []
  supplier: Supplier
  @Input() showObservation = true
  application: any = {}
  applicationDetail: any
  idApplication: any
  disabled = true
  fileData: any
  description: string
  uploadedFiles: any[] = []
  uploadProgress = 0
  fileUploaded: File
  hasUploadedFile: boolean
  data: FormData = new FormData()
  date: Date
  @ViewChild("fileInput") fileInput: any
  res = ""
  status = ""
  text = ""
  loading = false
  buttonLabel = "Enregistrer"
  buttonIcon = "pi pi-save"
  class = "btn btn-success pull-right"

  constructor(
    private uploadExcelFileService: UploadExcelFileService,
    private ref: DynamicDialogRef,
    public configService: ConfigService,
    public config: DynamicDialogConfig,
    private route: Router,
  ) {
    this.application = this.config.data.application
    this.notification = this.config.data.notification
    this.user = this.user.getUser()
  }

  source: string
  month: Month[] = Util.getMonths()
  trimester: Trimester[] = Util.getTrimesters()

  selectedMonth: Month
  selectedTrimester: Trimester
  base64: string

  ngOnInit() {
    this.source = this.config.data.contributionType
  }

  onFileSelected(event: any) {
    this.fileUploaded = event.target.files[0]
    this.hasUploadedFile = true
  }

  resetFileInput() {
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
    if (this.source == ContributionTypeEnum.TSC.value) {
      formData.append("source", this.source)
      formData.append("contributionType", this.config.data.typeCotisation)
      formData.append("file", this.fileUploaded)
      formData.append("month", this.selectedMonth.code.toString())
      formData.append("dateImport", this.date.toISOString())
    } else if (this.source == ContributionTypeEnum.FC.value || this.source == ContributionTypeEnum.PRIME_REDACTEUR.value) {
      formData.append("source", this.source)
      formData.append("contributionType", this.config.data.typeCotisation)
      formData.append("file", this.fileUploaded)
      formData.append("trimester", this.selectedTrimester.code.toString())
      formData.append("dateImport", this.date.toISOString())
    }
    this.uploadExcelFileService.uploadExcelFile(formData).subscribe(res => {
      this.messageToDisplay(res)
    })
  }

  goToHistory(res) {
    this.ref.close()
    this.route.navigate(["/history-details", res])
  }

  buttonInitialState() {
    this.buttonLabel = "Enregistrer"
    this.buttonIcon = "pi pi-save"
  }

  buttonStateWhenUploading() {
    this.buttonLabel = "Enregistrement en cours..."
    this.buttonIcon = "pi pi-spin pi-spinner"
  }

  messageToDisplay(res) {
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
}
