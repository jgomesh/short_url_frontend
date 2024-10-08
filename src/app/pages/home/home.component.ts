import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import httpUrl from '../../utils/config/httpconfig';
import { AppComponent } from '../../app.component';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    userToken: string = localStorage.getItem('token') || "";
    loading: boolean = false;
    shortUrl: string | null = null;
    successMessage: string | null = null;

    constructor(private http: HttpClient, private appComponent: AppComponent) {}

    ngOnInit() {
        const token = this.appComponent.token || localStorage.getItem('token');
        if (token) {
            this.userToken = token;
        }
    }

    onSubmit(original_url: string, event?: any) {
		if(event && event.key === "Enter") {
			event.preventDefault();
			if (original_url && !this.loading) {
				this.loading = true;
				this.postUrl(original_url);
			}
		} else if (!event) {
			if (original_url && !this.loading) {
				this.loading = true;
				this.postUrl(original_url);
			}
		}
    }

    postUrl(original_url: string) {
        const headers = this.userToken ? new HttpHeaders({
            'Authorization': `Bearer ${this.userToken}`
        }) : undefined;

        this.http.post(`${httpUrl}/shorten`, { original_url }, { headers })
            .pipe(
                tap((response: any) => {
                    if (response && response.shortUrl && response.shortUrl.length > 6) {
                        this.shortUrl = response.shortUrl;
                        this.successMessage = 'URL encurtada com sucesso!';
                    } else {
                        this.shortUrl = null;
                        this.successMessage = 'Erro ao encurtar a URL.';
                    }
                    this.loading = false;
                }),
                catchError(error => {
                    this.loading = false;
                    this.successMessage = 'Erro ao encurtar a URL.';
                    return of(error);
                })
            )
            .subscribe();
    }
}
