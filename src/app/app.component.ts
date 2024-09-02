import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { RouterOutlet, RouterLink } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  token: string = localStorage.getItem('token') || '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.token = localStorage.getItem('token') || '';
  }

  setToken(newToken: string) {
    this.token = newToken;
    localStorage.setItem('token', this.token);
    console.log("Token armazenado:", this.token);
  }

  logout() {
    this.token = '';
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
