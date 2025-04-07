import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Connexion</h2>
      
      <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {{ errorMessage }}
      </div>
      
      <form (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
          <input type="email" id="email" name="email" [(ngModel)]="email"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Votre email">
        </div>
        
        <div class="mb-6">
          <label for="password" class="block text-gray-700 font-medium mb-2">Mot de passe</label>
          <input type="password" id="password" name="password" [(ngModel)]="password"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Votre mot de passe"
                autocomplete="current-password">
        </div>
        
        <button type="submit" 
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
          Se connecter
        </button>
      </form>
      
      <div class="mt-4 text-center">
        <p>Pas encore de compte ? 
          <a routerLink="/auth/register" class="text-blue-600 hover:underline">S'inscrire</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) { }

  onSubmit() {
    this.errorMessage = '';
    
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez entrer votre email et votre mot de passe';
      return;
    }
    
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        // Navigation will be handled by the auth service
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = error.error?.message || 'Email ou mot de passe incorrect';
      }
    });
  }
} 