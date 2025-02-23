import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"
import { DomSanitizer, SafeUrl } from "@angular/platform-browser"
import { TranslateService } from "@ngx-translate/core"
import { GenericDialogConfig } from "src/app/core/generic-component/generic-dialog/generic-dialog-config.model"
import { DocViewerConfig } from "../../adhesion-cotisation/components/visualiser-document/document-config"

@Component({
  selector: "app-generic-image",
  templateUrl: "./generic-image.component.html",
  styleUrls: ["./generic-image.component.scss"],
})
export class GenericImageComponent implements OnInit {
  pathIconDocument = "../../../../assets/layout/images/adobe-pdf-file.svg"

  // Inputs
  _docConfigImg = new DocViewerConfig()
  @Input() set docConfigImg(docConfigImg: DocViewerConfig) {
    this._docConfigImg = docConfigImg
    this.openDialog()
  }
  // Ouputs
  @Output() saveEvent = new EventEmitter()
  @Output() actionsSupp = new EventEmitter()
  @Output() cancelEvent = new EventEmitter()
  @Output() closeEvent = new EventEmitter()

  dialogConfigImg?: GenericDialogConfig
  imageURL: SafeUrl

  constructor(
    public translate: TranslateService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.openDialog()
  }
  // Dialog
  openDialog = () => {
    this.imageURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this._docConfigImg.listPathdoc[0].path))
    this.dialogConfigImg = {
      showAction: true,
      display: true,
      title: this.docConfigImg.title,
      canSave: false,
      // documentAction: this.docConfig.documentActions,
      // areThereRequiredField: false,
      tabs: [],
    }
  }

  get docConfigImg() {
    return this._docConfigImg
  }

  updateCurrentDoc(current) {
    this.docConfigImg.pathDoc = current.path
  }

  save() {
    this.dialogConfigImg!.display = false
    this.saveEvent.emit(true)
  }

  close() {
    this.cancelEvent.emit(true)
  }

  actionSupp(sousAction) {
    this.actionsSupp.emit([sousAction.callback])
  }

  getDocumentName(elet: string) {
    return elet.substr(7).slice(0, -4)
  }
}
