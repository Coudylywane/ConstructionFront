import { DonneesAmortissement } from "./../generic-model/donneesAmortissement"
import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { catchError, map } from "rxjs/operators"
import { Observable, of } from "rxjs"
import { environment } from "src/environments/environment"

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json; charset=utf-8",
  }),
}

const httpOptions2 = {
  headers: new HttpHeaders({
    enctype: "multipart/form-data; charset=utf-8",
  }),
}

const httpOptions3 = {
  headers: new HttpHeaders({
    Accept: "application/json",
  }),
}
const httpOptionsText = {
  headers: new HttpHeaders({
    "Content-Type": "text/plain; charset=utf-8",
  }),
}

@Injectable()
export class GenericService {
  amortissements: DonneesAmortissement[] = []
  dateToday = new Date()
  month = [
    "Janvier",
    "Fevrier",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Aout",
    "Septembre",
    "Octobre",
    "Novembre",
    "Decembre",
  ]

  constructor(public http: HttpClient) {}

  private supplierURL = environment.api + "/supplier"

  private applicationURL = environment.api + "/application"

  getMonthName(year: number, monthNumber: string) {
    if (monthNumber) {
      const date = new Date(year, parseInt(monthNumber) - 1, 1)
      return date.toLocaleString("fr-FR", { month: "long" })
    }
    return ""
  }

  add<T>(url: string, body: T) {
    return this.http.post(url, body, httpOptions).pipe(catchError(this.handleError("add", body)))
  }
  addMap<T>(url: string, body: T) {
    return this.http.post(url, body, httpOptions).pipe(
      map((response: any) => {
        return response
      }),
      catchError(this.handleError("add", body))
    )
  }

  addFormdata<T>(url: string, body: T) {
    return this.http.post(url, body, httpOptions3).pipe(
      map((response: any) => {
        return response
      }),
      catchError(this.handleError("add", body))
    )
  }

  update<T>(url: string, body: T) {
    return this.http.put(url, body, httpOptions).pipe(catchError(this.handleError("update", body)))
  }

  delete<T>(url: string, identifiant: any) {
    return this.http.delete(url + "/" + identifiant, httpOptions).pipe(catchError(this.handleError("delete")))
  }

  getById<T>(url: string, id: any) {
    return this.http.get(url + "/" + id, httpOptions).pipe(catchError(this.handleError("getById", id)))
  }

  findwithtwoparameter<T>(url: string, parameter1: string, parameter2: string) {
    return this.http
      .get(url + "/" + parameter1 + "&" + "/" + parameter2, httpOptions)
      .pipe(catchError(this.handleError("findwithtwoparameter", [])))
  }

  /**adding the different searchParams to for mapping the right URL */

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error) // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`)
      return of(error as T)
    }
  }

  generateAmortization(montant: number, duree?: number, mensualite?: number) {
    this.amortissements = []
    let mois_echeance = Number(this.dateToday.getMonth())
    let year = Number(this.dateToday.getFullYear())
    let capital_restant: number = montant
    if (duree) {
      mensualite = Math.round(montant / duree)
    }
    let VNC = mensualite + 1
    let i = 1
    while (VNC >= mensualite) {
      VNC = capital_restant - mensualite

      if (mois_echeance == 11) {
        this.amortissements.push({
          periode_mensuelle: i++,
          mois_echeance: this.month[mois_echeance] + "/" + year,
          capital_restant: Math.round(capital_restant),
          mensualite_constante: Math.round(mensualite),
          VNC: VNC,
        })
        capital_restant = capital_restant - mensualite
        mois_echeance = 0
        year = year + 1
      } else {
        this.amortissements.push({
          periode_mensuelle: i++,
          mois_echeance: this.month[mois_echeance] + "/" + year,
          capital_restant: Math.round(capital_restant),
          mensualite_constante: Math.round(mensualite),
          VNC: VNC,
        })
        mois_echeance = mois_echeance + 1
        capital_restant = capital_restant - mensualite
      }
    }
    if (VNC != 0) {
      this.amortissements.push({
        periode_mensuelle: i++,
        mois_echeance: this.month[mois_echeance] + "/" + year,
        capital_restant: Math.round(capital_restant),
        mensualite_constante: Math.round(VNC),
        VNC: 0,
      })
    }
    return this.amortissements
  }
}
