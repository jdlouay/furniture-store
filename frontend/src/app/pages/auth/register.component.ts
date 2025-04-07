import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Inscription</h2>
      
      <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {{ errorMessage }}
      </div>
      
      <form (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label for="username" class="block text-gray-700 font-medium mb-2">Nom d'utilisateur</label>
          <input type="text" id="username" name="username" [(ngModel)]="username"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Votre nom d'utilisateur">
        </div>
        
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
          <input type="email" id="email" name="email" [(ngModel)]="email"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Votre email">
        </div>
        
        <div class="mb-4">
          <label for="password" class="block text-gray-700 font-medium mb-2">Mot de passe</label>
          <input type="password" id="password" name="password" [(ngModel)]="password"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Votre mot de passe"
                autocomplete="new-password">
        </div>
        
        <div class="mb-6">
          <label for="confirmPassword" class="block text-gray-700 font-medium mb-2">Confirmer le mot de passe</label>
          <input type="password" id="confirmPassword" name="confirmPassword" [(ngModel)]="confirmPassword"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirmez votre mot de passe"
                autocomplete="new-password">
        </div>
        
        <button type="submit" 
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
          S'inscrire
        </button>
      </form>
      
      <div class="mt-4 text-center">
        <p>Déjà inscrit ? 
          <a routerLink="/auth/login" class="text-blue-600 hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) { }

  onSubmit() {
    this.errorMessage = '';
    
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Tous les champs sont obligatoires';
      return;
    }
    
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }
    
    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        // Navigation will be handled by the auth service
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors de l\'inscription';
      }
    });
  }
} 