import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';

type AuthMode = 'login' | 'register';

interface ConstellationNode {
  x: number;
  y: number;
  r: number;
  fill: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private toast = inject(ToastService);
  private auth = inject(AuthService);
  private router = inject(Router);

  isDark = signal(this.getInitialTheme());

  mode: AuthMode = 'login';
  showPw = false;
 
  loginData = {
    identifier: '',
    password: '',
    remember: false,
  };
 
  registerData = {
    displayName: '',
    username: '',
    password: '',
  };

  displayNamePattern = /^\p{L}+([ '\-]\p{L}+)*$/u;

  constructor() {
    effect(() => {
      document.documentElement.classList.toggle('dark', this.isDark());
      localStorage.setItem('sanga-theme', this.isDark() ? 'dark' : 'light');
    });
  }
 
  toggleTheme() {
    this.isDark.update(v => !v);
  }

  private getInitialTheme(): boolean {
    const saved = localStorage.getItem('sanga-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  switchMode(next: AuthMode): void {
    if (next === this.mode) return;
    this.mode = next;
    this.showPw = false;
  }
 
  togglePw(): void {
    this.showPw = !this.showPw;
  }
 
  handleLogin(): void {
    this.auth.login({
      username: this.loginData.identifier,
      password: this.loginData.password,
    }).subscribe({
      next: () => {
        this.toast.success('Login successful');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.toast.error('Invalid username or password');
      },
    });
  }

  handleRegister(): void {
    this.auth.register({
      username: this.registerData.username,
      password: this.registerData.password,
      displayName: this.registerData.displayName,
    }).subscribe({
      next: () => {
        this.toast.success('Account created successfully');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const message = err.status === 409 ? 'Username is already in use' : 'Registration failed';
        this.toast.error(message);
      },
    });
  }

}
