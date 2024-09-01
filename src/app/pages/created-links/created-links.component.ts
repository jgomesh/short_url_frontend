import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import httpUrl from '../../utils/config/httpconfig';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-created-links',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './created-links.component.html',
  styleUrls: ['./created-links.component.scss']
})
export class CreatedLinksComponent implements OnInit {
  errorMessage: string = '';
  loading: boolean = true;
  links: any[] = [];
  httpString: string = httpUrl;

  constructor(private http: HttpClient, private appComponent: AppComponent, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.loadLinks();
    }
  }

  loadLinks() {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined;

    this.http.get<any>(`${httpUrl}/linksUsed`, { headers })
      .pipe(
        tap(response => {
          this.links = response.urls.sort((a: any, b: any) => b.click_count - a.click_count);
          this.loading = false;
        }),
        catchError(error => {
          this.errorMessage = 'Erro ao carregar links.';
          this.loading = false;
          return of([]);
        })
      )
      .subscribe();
  }

  trackClick(linkId: string, event: MouseEvent): void {
    event.preventDefault(); // Prevent default link behavior
    console.log('Link clicked:', linkId);
  
    const link = this.links.find(l => l.id === linkId);
    if (link) {
      link.click_count += 1;
      
      // Use a delay to ensure the click count is updated before navigating
      setTimeout(() => {
        const linkElement = document.querySelector(`a[href*="${link.short_code}"]`) as HTMLAnchorElement;
        if (linkElement) {
          window.open(linkElement.href, '_blank'); // Open the link in a new tab or window
        }
      }, 100); // Adjust delay as needed
    }
  }

  editLink(link: any): void {
    link.editing = true;
    link.newOriginalUrl = link.original_url; // Ensure this is set when entrando em modo de edição
  }

  saveLink(link: any, newOriginalUrl: string): void {
    link.loading = true; // Start loading

    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined;

    this.http.put(`${httpUrl}/urls/${link.short_code}`, { original_url: newOriginalUrl }, { headers })
      .pipe(
        tap((response: any) => {
          console.log('URL atualizada:', response);
          link.original_url = newOriginalUrl; // Update link with new URL
          link.editing = false; // Exit edit mode
          link.loading = false; // Stop loading
        }),
        catchError(error => {
          this.errorMessage = 'Erro ao atualizar a URL.';
          link.loading = false; // Stop loading on error
          return of(error);
        })
      )
      .subscribe();
  }

  deleteLink(shortCode: string): void {
    const link = this.links.find(l => l.short_code === shortCode);
    if (link) {
      link.loading = true; // Start loading
    }

    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined;

    this.http.delete(`${httpUrl}/urls/${shortCode}`, { headers })
      .pipe(
        tap(() => {
          console.log('Link deletado:', shortCode);
          this.links = this.links.filter(link => link.short_code !== shortCode);
        }),
        catchError(error => {
          this.errorMessage = 'Erro ao deletar o link.';
          if (link) {
            link.loading = false; // Stop loading on error
          }
          return of(error);
        })
      )
      .subscribe();
  }

  getInputValue(id: string): string {
    const inputElement = document.getElementById('newOriginalUrl-' + id) as HTMLInputElement;
    return inputElement ? inputElement.value : '';
  }

  trackById(index: number, link: any): string {
    return link.id;
  }
}
