import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Inscription Administrateur</h2>
      
      <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {{ errorMessage }}
      </div>
      
      <form (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label for="username" class="block text-gray-700 font-medium mb-2">Nom d'utilisateur</label>
          <input type="text" id="username" name="username" [(ngModel)]="username"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom d'utilisateur admin">
        </div>
        
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
          <input type="email" id="email" name="email" [(ngModel)]="email"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email admin">
        </div>
        
        <div class="mb-4">
          <label for="password" class="block text-gray-700 font-medium mb-2">Mot de passe</label>
          <input type="password" id="password" name="password" [(ngModel)]="password"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mot de passe admin"
                autocomplete="new-password">
        </div>
        
        <div class="mb-6">
          <label for="confirmPassword" class="block text-gray-700 font-medium mb-2">Confirmer le mot de passe</label>
          <input type="password" id="confirmPassword" name="confirmPassword" [(ngModel)]="confirmPassword"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirmez le mot de passe"
                autocomplete="new-password">
        </div>
        
        <button type="submit" 
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
          Créer le compte administrateur
        </button>
      </form>
    </div>
  `
})
export class RegisterAdminComponent {
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
    
    this.authService.registerAdmin({
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('Admin registration successful', response);
        // La navigation sera gérée par le service auth
      },
      error: (error) => {
        console.error('Admin registration failed', error);
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors de la création du compte administrateur';
      }
    });
  }
} 