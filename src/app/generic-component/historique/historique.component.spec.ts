import { ComponentFixture, TestBed } from "@angular/core/testing"

import { HistoriqueComponent } from "./historique.component"
import { TraiterDemandeServices } from "../../prestation-sociale/services/traiterDemandeServices"
import { HttpClient, HttpHandler } from "@angular/common/http"
import { BreadcrumbService } from "../../../core/breadcrumb/breadcrumb.service"
import { KeycloakService } from "keycloak-angular"
import { Router } from "@angular/router"
import { of } from "rxjs"
import { Observation } from "../../prestation-sociale/models/observation"
import { ApplicationStatusProperties } from "../../constant/applicationStatus"
import { Role } from "../../constant/roles"

const observationsMock:Partial<Observation>[] = [{
  id:	"OBS-07-10-2024-0000088",
  description:	"Tableau d'amortissement validé avec succès",
  observationDate:	new Date("2024-10-07T16:32:35.131247"),
  userSender:	"daf@gmail.com",
  profilUser:	"CSA",
  profilSender:	"DAF",
  userReceiver:	"csa@gmail.com",
  fullNameSender:	"daf LastName4",
  applicationStatus:	"DEMANDE_ACCEPTEE",
}]

describe("HistoriqueComponent", () => {
  let component: HistoriqueComponent
  let fixture: ComponentFixture<HistoriqueComponent>
  let keycloakService: KeycloakService
  const keycloakServiceMock = {
    getUserRoles: jest.fn().mockReturnValue(['CMS', 'SE', 'GCC']),
    getUsername: jest.fn().mockReturnValue("username"),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoriqueComponent],
      providers:[TraiterDemandeServices,HttpClient,HttpHandler,
        BreadcrumbService,
        { provide: KeycloakService ,useValue: keycloakServiceMock},
        { provide: Router ,useValue: {navigate:jest.fn()}},
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should test getObservations method correctly", () => {
    jest.spyOn(component["traiterDemandeService"], 'getApplicationObservations').mockReturnValue(of(observationsMock))
    component.applicationId = 'APP01'
    component.getObservations()
    expect(component.observations.length).toEqual(1)
    expect( component.isDataRecoveryLoan).toBeTruthy()


  })


  it("should test getTitleObservation method correctly ", () => {
    component.historyType = 'pret'
    const  libele1 = component.getTitleObservation('DEMANDE_ACCEPTEE')

    expect(libele1).toEqual(ApplicationStatusProperties['DEMANDE_ACCEPTEE'].libele)
    const  fakeLibele = component.getTitleObservation('DEMANDE_ACCEPTE')
    expect(fakeLibele).not.toEqual(ApplicationStatusProperties['DEMANDE_ACCEPTEE'].libele)
  })


  it("should test getLibeleApplicationActorInfo method correctly ", () => {
    component.emailAgentLogged = 'gcc@test'
    component.roleAgentConnected = Role.GCC

    /*--------------*/
    let userSender:string = 'se@test'
    let  fullNameSender: string = 'se mds'
    let profilSender: string = Role.SE
    let itemInfo = component.getLibeleApplicationActorInfo(userSender,fullNameSender,profilSender)
    expect(itemInfo.libele).toEqual(`Fait par se mds (SE)` )
    expect(itemInfo.isActorConnected).not.toBeTruthy()

    /*--------------*/
    userSender = component.emailAgentLogged
    fullNameSender = 'gcc mds'
    profilSender = Role.GCC
    itemInfo = component.getLibeleApplicationActorInfo(userSender,fullNameSender,profilSender)
    expect(itemInfo.libele).toEqual(`Fait par Moi` )
    expect(itemInfo.isActorConnected).toBeTruthy()

    /*--------------*/
    userSender = '1234-A'
    fullNameSender = 'mutualiste mds'
    profilSender = 'MUTUALISTE'
    itemInfo = component.getLibeleApplicationActorInfo(userSender,fullNameSender,profilSender)
    expect(itemInfo.libele).toEqual(`Fait par le Mutualiste` )
    expect(itemInfo.isActorConnected).not.toBeTruthy()
  })
})
