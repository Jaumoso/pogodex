import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdvancedChecklistService } from '../services/advanced-checklist.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule, MatSlideToggleModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private readonly authService: AuthService,
    private readonly advancedCheclistService: AdvancedChecklistService,
    private readonly router: Router
  ) {}

  isLoggedIn: boolean = false;
  private loggedInSubscription!: Subscription;

  onToggleChange(event: any) {
    this.advancedCheclistService.setAdvanced(event.checked);
  }

  logOut() {
    this.authService.closeSession();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.loggedInSubscription = this.authService.loggedIn$.subscribe(
      (status) => {
        this.isLoggedIn = status;
      }
    );

    const goToTopButton = document.getElementById('go-to-top');
    if (goToTopButton) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
          goToTopButton.style.display = 'block';
        } else {
          goToTopButton.style.display = 'none';
        }
      });

      goToTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });
    }
  }

  ngOnDestroy(): void {
    this.loggedInSubscription.unsubscribe();
  }
}
