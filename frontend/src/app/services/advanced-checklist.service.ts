import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdvancedChecklistService {
  private readonly isAdvancedChecklist = new BehaviorSubject<boolean>(false);
  advancedChecklist$ = this.isAdvancedChecklist.asObservable();

  toggleAdvanced() {
    this.isAdvancedChecklist.next(!this.isAdvancedChecklist.value);
  }

  setAdvanced(state: boolean) {
    this.isAdvancedChecklist.next(state);
  }
}
