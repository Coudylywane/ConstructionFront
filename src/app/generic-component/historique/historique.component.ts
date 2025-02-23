import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"
import { PrimeIcons } from "primeng/api"
import { Observation } from "../../prestation-sociale/models/observation"
import { TraiterDemandeServices } from "../../prestation-sociale/services/traiterDemandeServices"
import { ApplicationStatusProperties } from "../../constant/applicationStatus"
import { UserService } from "../../prestation-sociale/services/user.service"
import { FraisObsequeService } from "../../prestation-sociale/services/frais-obseque.service"
import { ApplicationFuneralExpensesStatusEnumProperties } from "../../constant/applicationFuneralExpensesStatus"
import { IdrService } from "../../prestation-sociale/services/idr.service"
import { ApplicationIdrStatusEnumProperties } from "../../constant/applicationIdrStatus"

@Component({
  selector: "app-historique",
  templateUrl: "./historique.component.html",
  styleUrls: ["./historique.component.scss"],
})
export class HistoriqueComponent implements OnInit {
  @Input() applicationId: string
  @Input() applicationFOId: string
  @Input() applicationIDRId: string
  @Input() historyType: "frais-obseque" | "pret" | "idr"
  observations: Observation[]
  emailAgentLogged: string
  roleAgentConnected: string
  @Output() lastObservationApplication = new EventEmitter<{ userReceiver: string, userSender: string, profilUser: string, profilSender: string }>()
  listevent: {
    description: string
    applicationStatus: string
    observationDate: Date
    icon?: PrimeIcons
    color?: string
    image?: string
    userReceiver: string
    userSender: string
    profilUser: string
    profilSender: string
    fullNameSender: string
  }[]

  constructor(
    private traiterDemandeService: TraiterDemandeServices,
    private userService: UserService,
    private fraisObsequeService: FraisObsequeService,
    private idrService: IdrService
  ) {}

  ngOnInit(): void {

    this.emailAgentLogged = this.userService.getEmailAgentConnected()
    this.roleAgentConnected = this.userService.roleAgentConnected()
    this.getObservations()

  }

  setListEvent(observations: Observation[]) {
    this.listevent = observations.map((observation: Observation) => {
      return {
        applicationStatus: observation.applicationStatus,
        description: observation.description,
        observationDate: observation.observationDate,
        userReceiver: observation.userReceiver,
        userSender: observation.userSender,
        profilUser: observation.profilUser,
        profilSender: observation.profilSender,
        fullNameSender: observation.fullNameSender,
      }
    })
  }

  getObservations() {
    if (this.applicationId){
      this.traiterDemandeService
        .getApplicationObservations(this.applicationId)
        .subscribe(value => {
          this.observations = [...value]
          this.lastObservationApplication.emit({...this.getLastObservation()})
          this.setListEvent(this.observations)
        })
    }else
      if(this.applicationFOId){
      this.fraisObsequeService
        .getApplicationObservations(this.applicationFOId,this.emailAgentLogged,{perPage:25})
        .subscribe(value => {
          this.observations = [...value.content]
          this.lastObservationApplication.emit({...this.getLastObservation()})
          this.setListEvent(this.observations)
        })
    }else
      if (this.applicationIDRId){
        this.idrService
          .getApplicationObservations(this.applicationIDRId,{perPage:25})
          .subscribe(value => {
            this.observations = [...value.content]
            this.lastObservationApplication.emit({...this.getLastObservation()})
            this.setListEvent(this.observations)
          })
    }

  }

  get isDataRecoveryLoan(): boolean {
    if(!this.observations?.length  || this.observations?.length > 1  ) return false
    return  this.observations[0].applicationStatus === 'DEMANDE_ACCEPTEE'
  }

  getTitleObservation(applicationStatus: any) {
    if (this.historyType === "frais-obseque"){
      return ApplicationFuneralExpensesStatusEnumProperties[applicationStatus]?.libele ?? 'Demande ...'
    }else if (this.historyType === "pret"){
      return ApplicationStatusProperties[applicationStatus]?.libele ?? 'Demande ...'
    }else if (this.historyType === "idr"){
      return ApplicationIdrStatusEnumProperties[applicationStatus]?.libele ?? 'Demande ...'
    }
    return 'Demande ...'
  }

  getLibeleApplicationActorInfo(userSender:string , fullNameSender: string, profilSender: string):{ libele:string, isActorConnected:boolean } {

    if(this.emailAgentLogged === userSender && this.roleAgentConnected === profilSender){
      return { libele:"Fait par Moi", isActorConnected:true }
    }

    if(profilSender === 'MUTUALISTE'){
      return  { libele: "Fait par le Mutualiste", isActorConnected: false }
    }

    return { libele: `Fait par ${ fullNameSender} (${profilSender ?? ''})`, isActorConnected: false }
  }

  getLastObservation(): {userReceiver: string,userSender: string,profilUser: string,profilSender: string }{
    let  lastObservationProps= { userReceiver: null, userSender: null, profilUser: null, profilSender: null, }
    this.observations.sort((o1,o2) => (new Date(o2?.observationDate)).getTime() - (new Date(o1?.observationDate)).getTime() )
    if(this.observations?.length){
      lastObservationProps.userReceiver = this.observations[0].userReceiver
      lastObservationProps.userSender = this.observations[0].userSender
      lastObservationProps.profilUser = this.observations[0].profilUser
      lastObservationProps.profilSender = this.observations[0].profilSender
    }
    return lastObservationProps

  }
}
