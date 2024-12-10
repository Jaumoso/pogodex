import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      username: this.username,
      password: this.password,
      passwordValidation: this.passwordValidation,
    });

    merge(
      this.username.statusChanges,
      this.password.valueChanges,
      this.passwordValidation.valueChanges
    )
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
    // TODO: More password validations
  ]);
  passwordValidation = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    // TODO: More password validations
  ]);

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/pokelist');
    }
  }

  register() {
    if (this.registerForm.valid) {
      const { username, password } = this.registerForm.value;
      this.authService.trainerRegister(username, password).subscribe({
        next: (response) => {
          if (response?.token) {
            this.authService.setSession(response.token);
            this.router.navigateByUrl('login');
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
