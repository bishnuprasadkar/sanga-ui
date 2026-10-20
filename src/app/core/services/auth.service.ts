import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RegisterRequest {
  username: string;
  password: string;
  displayName: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CurrentUser {
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/auth`;

  register(request: RegisterRequest): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/register`, request, { withCredentials: true });
  }

  login(request: LoginRequest): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/login`, request, { withCredentials: true });
  }

  refresh(): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/refresh`, {}, { withCredentials: true }
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/logout`, {}, { withCredentials: true }
    );
  }

  getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${environment.apiUrl}/users/me`, {
      withCredentials: true
    });
  }
}
