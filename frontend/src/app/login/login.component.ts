import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: this.username,
      password: this.password,
    });

    merge(this.username.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  username = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(50),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    // Validators.pattern(
    //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#%&*])(?=.{8,})/
    // ),
  ]);

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/pokelist']);
    }
  }

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.trainerLogin(username, password).subscribe({
        next: (response) => {
          if (response?.token) {
            console.log(response.token);
            this.authService.setSession(response.token);
            this.router.navigate(['pokelist']);
          }
        },
      });
    }
  }

  errorMessage = signal('');
  updateErrorMessage() {
    if (this.username.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.username.hasError('minlength')) {
      this.errorMessage.set('Minimum 4 chars long');
    } else if (this.username.hasError('maxlength')) {
      this.errorMessage.set('Maximum 50 chars long');
    } else if (this.password.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.password.hasError('minlength')) {
      this.errorMessage.set('Minimum 8 chars long');
    } else if (this.password.hasError('password')) {
      this.errorMessage.set('Not a valid password');
    } else {
      this.errorMessage.set('');
    }
  }

  showPassword: boolean = false;
  autocomplete: boolean = false;
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
