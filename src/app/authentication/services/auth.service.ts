import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RoleModel } from 'src/app/shared/models/role.model';
import { UtilisateurModel } from 'src/app/shared/models/utilisateur.model';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private SECRET = 'smartmaskosc2020';
  errCon = false;
  utilisateur?: UtilisateurModel;

  constructor(private router: Router, private http: HttpClient) {}

  async authenticationProcess(url: string, body: any) {
    console.log(body, url);
    try {
      const data = await this.http.post<any>(url, body).toPromise();
      console.log('Login réussi:', data);
      await this.setSession(data);
      const user = await this.identity().toPromise();
      console.log('Utilisateur récupéré après login:', user);
      if (
        this.hasAuthority(
          ['SUPER_ADMIN', 'ADMIN', 'S', 'GS', 'CP', 'CLIENT'],
          user
        )
      ) {
        await this.storeUser(user);
        this.router.navigate(['/gestion-article/Dashboard']);
      } else {
        console.error('Rôle non autorisé:', user?.role?.libelle);
        this.errCon = true;
      }
    } catch (error) {
      console.error("Erreur lors de l'authentification:", error);
      this.errCon = true;
    }
    return this.errCon;
  }

  async login(credentials: any) {
    return this.authenticationProcess('/api/login', {
      login: credentials.login,
      password: credentials.password,
    });
  }

  async setSession(authResult: any) {
    localStorage.removeItem('id_token');
    localStorage.setItem('id_token', authResult.token);
  }

  async storeUser(user: any) {
    localStorage.removeItem('mdd_user');
    localStorage.setItem('mdd_user', JSON.stringify(user));
  }

  token() {
    return localStorage.getItem('id_token')?.toString();
  }

  getCurrentUserRoles(): RoleModel[] {
    const user = JSON.parse(localStorage.getItem('mdd_user') || '{}');
    return user?.role ? [user.role] : [];
  }

  isClient(): boolean {
    const roles = this.getCurrentUserRoles();
    return roles.some((role) => role.libelle === 'CLIENT');
  }

  getUserId(): number | null {
    const user = JSON.parse(localStorage.getItem('mdd_user') || '{}');
    return user.id || null;
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('mdd_user');
    this.router.navigate(['/login']);
  }

  identity() {
    console.log('[AuthService] Appel de identity()');
    return this.http.get<any>('/api/connected-user');
  }

  convertText(conversion: string, user: any) {
    if (conversion === 'encrypt') {
      return CryptoJS.AES.encrypt(
        JSON.stringify(user).trim(),
        this.SECRET.trim()
      ).toString();
    } else {
      const bytes = CryptoJS.AES.decrypt(user, this.SECRET.trim());
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
    }
  }

  hasAuthority(authorities: string[], user: UtilisateurModel): boolean {
    return user.role?.libelle
      ? authorities.includes(user?.role?.libelle)
      : false;
  }
}
