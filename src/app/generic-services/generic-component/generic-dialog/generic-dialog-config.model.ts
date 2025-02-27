export class GenericDialogTab {
  name: string
  required: boolean
  disabled?: boolean
  warning?: boolean

  constructor(obj: any = {}) {
    this.name = obj.name
    this.required = obj.required
    this.disabled = obj.disabled
    this.warning = obj.warning
  }
}

export class GenericDialogConfig {
  display?: boolean
  title?: string
  tabs?: GenericDialogTab[] = []
  canSave?: boolean
  isDisable?: boolean
  showAction?: boolean
  documentAction?: any[]
  areThereRequiredField?: boolean

  constructor(obj: any = {}) {
    this.display = obj.display
    this.title = obj.title
    this.tabs = obj.tabs
    this.canSave = obj.canSave
    this.showAction = obj.showAction
    this.documentAction = obj.documentAction
    this.areThereRequiredField = obj.areThereRequiredField
    this.isDisable = obj.isDisable
  }
}
