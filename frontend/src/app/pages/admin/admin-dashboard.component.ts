import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Tableau de bord administrateur</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Carte Gestion des Utilisateurs -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Gestion des Utilisateurs</h2>
          <p class="text-gray-600 mb-4">Gérer les comptes utilisateurs et leurs permissions</p>
          <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Gérer les utilisateurs
          </button>
        </div>

        <!-- Carte Gestion des Produits -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Gestion des Produits</h2>
          <p class="text-gray-600 mb-4">Ajouter, modifier ou supprimer des produits</p>
          <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Gérer les produits
          </button>
        </div>

        <!-- Carte Gestion des Commandes -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Gestion des Commandes</h2>
          <p class="text-gray-600 mb-4">Suivre et gérer les commandes des clients</p>
          <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Gérer les commandes
          </button>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Vérifier si l'utilisateur est bien un admin
    this.authService.currentUser$.subscribe(user => {
      if (!user || user.role !== 'admin') {
        // Rediriger vers la page d'accueil si l'utilisateur n'est pas admin
        window.location.href = '/';
      }
    });
  }
} 