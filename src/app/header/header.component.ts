import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [RouterOutlet, FormsModule, RouterLink],
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private router: Router, public appComponent: AppComponent) {}


  ngOnInit() {
    this.appComponent.token = localStorage.getItem('token') || "";
  }

  setToken(newToken: string) {
    this.appComponent.token = newToken;
    localStorage.setItem('token', this.appComponent.token);
    console.log("Token armazenado:", this.appComponent.token);
  }

  logout() {
    this.appComponent.token = "";
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
