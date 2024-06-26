import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  private subject = new Subject<any>();

  constructor() {}

    confirmThis(message: string, yesFn: () => void, noFn: () => void): any {
        this.setConfirmation(message, yesFn, noFn);
    }

    setConfirmation(message: string, yesFn: () => void, noFn: () => void): any {
        const that = this;
        this.subject.next({
            type: 'confirm',
            text: message,
            yesFn(): any {
                    that.subject.next(''); // This will close the modal
                    yesFn();
                },
            noFn(): any {
                that.subject.next('');
                noFn();
            }
        });

    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
