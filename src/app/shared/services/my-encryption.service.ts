import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class MyEncryptionService {
  private encPassword = 'momedroneBoulangerie2022';
  constructor() { }

  //method is used to encrypt the text
  encryptText(text:string) {

    return CryptoJS.AES.encrypt(text, this.encPassword).toString();

  }

  //method is used to decrypt the text
  decryptText(text: string) {
    return CryptoJS.AES.decrypt(text, this.encPassword).toString(CryptoJS.enc.Utf8);
  }
}
