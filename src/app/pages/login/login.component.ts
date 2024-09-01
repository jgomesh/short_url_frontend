import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import httpUrl from '../../utils/config/httpconfig';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [RouterOutlet, RouterLink],
})
export class LoginComponent {
  emailError: string = '';
  passwordError: string = '';
  errorMessage: string = '';  // Mensagem de erro global
  loading: boolean = false;
  
  constructor(private http: HttpClient, private appComponent: AppComponent, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    console.log("Token from localStorage:", token);

    if (token) {
      this.router.navigate(['/home']);
    }
  }

  validateForm(email: string, password: string): boolean {
    let isValid = true;

    if (!email) {
      this.emailError = 'O e-mail não pode estar vazio.';
      isValid = false;
    } else if (!this.isValidEmail(email)) {
      this.emailError = 'Insira um e-mail válido.';
      isValid = false;
    } else {
      this.emailError = '';
    }

    if (!password) {
      this.passwordError = 'A senha não pode estar vazia.';
      isValid = false;
    } else {
      this.passwordError = '';
    }

    return isValid;
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailPattern.test(email);
  }


  onSubmit(email: HTMLInputElement, password: HTMLInputElement, event?: any) {
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    
    if (event && event.key === 'Enter') {
      if(this.loading) {
        return
      }
      this.loading = true;
      event.preventDefault();
      if (!this.validateForm(emailValue, passwordValue)) {
        this.loading = false;
        return;
      }

      this.http.post<{ token: string, status: string, role: string, id: number }>(`${httpUrl}/login`, { email: emailValue, password: passwordValue })
        .pipe(
          tap((response) => {
            console.log('Success:', response);
            if (response && response.status === "ok") {
              this.appComponent.setToken(response.token);
              this.loading = false;
              this.router.navigate(['/home']);
            }  else {
              this.loading = false;
              this.errorMessage = 'E-mail ou senha incorretos.';
            }
          }),
          catchError(error => {
            this.loading = false;
            this.errorMessage = 'E-mail ou senha incorretos.';
            return of(error);
          })
        )
        .subscribe();
        
    } else if (!event) {
      if(this.loading) {
        return
      }
      this.loading = true;
      if (!this.validateForm(emailValue, passwordValue)) {
        this.loading = false;
        return;
      }
      
      this.http.post<{ token: string, status: string, role: string, id: number }>(`${httpUrl}/login`, { email: emailValue, password: passwordValue })
        .pipe(
          tap((response) => {
            console.log('Success:', response);
            if (response && response.status === "ok") {
              this.appComponent.setToken(response.token);
              localStorage.setItem("token", response.token);
              this.loading = false;
              this.router.navigate(['/home']);
            }  else {
              this.loading = true;
              this.errorMessage = 'E-mail ou senha incorretos.';
            }
          }),
          catchError(error => {
            this.loading = false;
            this.errorMessage = 'E-mail ou senha incorretos.';
            return of(error);
          })
        )
        .subscribe();

    }
  }
}
