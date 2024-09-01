import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';  // Importar Router para navegação
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {RouterOutlet, RouterLink} from '@angular/router';
import httpUrl from '../../utils/config/httpconfig';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [RouterOutlet, RouterLink],
})
export class RegisterComponent {
  successMessage: string | null = null;  // Feedback de sucesso
  nameError: boolean = false;
  emailError: boolean = false;
  passwordError: boolean = false;
  loading: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  private validateFields(name: HTMLInputElement, email: HTMLInputElement, password: HTMLInputElement, confirmPassword: HTMLInputElement): boolean {
    // Reset errors
    this.nameError = false;
    this.emailError = false;
    this.passwordError = false;

    let isValid = true;

    if (!name.value) {
      this.nameError = true;
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
      this.emailError = true;
      isValid = false;
    }

    if (password.value.length < 6) {
      this.passwordError = true;
      isValid = false;
    }

    if (password.value !== confirmPassword.value || !password.value || !confirmPassword.value) {
      this.passwordError = true;
      isValid = false;
    }

    return isValid;
  }

  private submitForm(name: HTMLInputElement, email: HTMLInputElement, password: HTMLInputElement) {
    if(this.loading) {
      return
    }
    this.loading = true;

    this.http.post(`${httpUrl}/register`, {
      name: name.value,
      email: email.value,
      password: password.value
    })
    .pipe(
      tap(response => {
        this.successMessage = 'Registration successful! Redirecting...';
        console.log('Registration Success:', response);

        setTimeout(() => {
          this.router.navigate(['/register-complete']);
          this.loading = false;
        }, 2000);
      }),
      catchError(error => {
        console.error('Registration Error:', error);
        return of(error);
      })
    )
    .subscribe();
  }

  onSubmit(name: HTMLInputElement, email: HTMLInputElement, password: HTMLInputElement, confirmPassword: HTMLInputElement, event?: KeyboardEvent) {
    if (event && event.key === 'Enter') {
      console.log('Tecla Enter pressionada');
      if (this.validateFields(name, email, password, confirmPassword)) {
        this.submitForm(name, email, password);
      }
    } else if (!event) {
      if (this.validateFields(name, email, password, confirmPassword)) {
        this.submitForm(name, email, password);
      }
    }
  }
}
