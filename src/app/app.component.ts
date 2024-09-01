import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  token: string = "";

  constructor(private router: Router) {}

  ngOnInit() {
    this.token = localStorage.getItem('token') || "";
  }

  setToken(newToken: string) {
    this.token = newToken;
    localStorage.setItem('token', this.token);
    console.log("Token armazenado:", this.token);
  }

  logout() {
    this.token = "";
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
