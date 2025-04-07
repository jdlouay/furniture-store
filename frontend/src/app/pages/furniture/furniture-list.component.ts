import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Furniture {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-furniture-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold mb-6 text-gray-900">Notre Collection de Meubles</h1>
      
      <!-- Filtres -->
      <div class="mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select id="category" 
                   class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="">Toutes les catégories</option>
              <option value="sofa">Canapés</option>
              <option value="table">Tables</option>
              <option value="chair">Chaises</option>
              <option value="bed">Lits</option>
            </select>
          </div>
          
          <div class="flex-1 min-w-[200px]">
            <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Prix</label>
            <select id="price" 
                   class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="">Tous les prix</option>
              <option value="0-200">Moins de 200€</option>
              <option value="200-500">200€ - 500€</option>
              <option value="500-1000">500€ - 1000€</option>
              <option value="1000+">Plus de 1000€</option>
            </select>
          </div>
          
          <div class="flex-1 min-w-[200px]">
            <label for="sort" class="block text-sm font-medium text-gray-700 mb-1">Trier par</label>
            <select id="sort" 
                   class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="popular">Popularité</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="newest">Nouveautés</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Liste de produits -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let item of furnitureItems" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div class="relative h-64 overflow-hidden">
            <img [src]="item.imageUrl" [alt]="item.name" 
                class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300">
          </div>
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-2 text-gray-900">{{item.name}}</h2>
            <p class="text-gray-600 mb-4">{{item.description}}</p>
            <div class="flex justify-between items-center">
              <span class="text-xl font-bold text-gray-900">{{item.price}} €</span>
              <button class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div class="mt-8 flex justify-center">
        <nav class="inline-flex rounded-md shadow">
          <a href="#" class="py-2 px-4 bg-white border border-gray-300 rounded-l-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Précédent
          </a>
          <a href="#" class="py-2 px-4 bg-indigo-600 border border-indigo-600 text-sm font-medium text-white">
            1
          </a>
          <a href="#" class="py-2 px-4 bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
            2
          </a>
          <a href="#" class="py-2 px-4 bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
            3
          </a>
          <a href="#" class="py-2 px-4 bg-white border border-gray-300 rounded-r-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Suivant
          </a>
        </nav>
      </div>
    </div>
  `
})
export class FurnitureListComponent implements OnInit {
  furnitureItems: Furniture[] = [];
  
  ngOnInit() {
    // Simuler des données de produits
    this.furnitureItems = [
      {
        id: '1',
        name: 'Canapé Moderne',
        description: 'Un canapé confortable avec un design élégant qui s\'adapte à tout intérieur.',
        price: 799,
        imageUrl: 'assets/images/sofa.jpg'
      },
      {
        id: '2',
        name: 'Table à Manger',
        description: 'Table à manger en bois massif, idéale pour les dîners en famille.',
        price: 599,
        imageUrl: 'assets/images/table.jpg'
      },
      {
        id: '3',
        name: 'Fauteuil Confort',
        description: 'Fauteuil ergonomique pour un confort optimal même après de longues heures.',
        price: 349,
        imageUrl: 'assets/images/chair.jpg'
      },
      {
        id: '4',
        name: 'Lit Design',
        description: 'Lit moderne avec tête de lit rembourrée et rangements intégrés.',
        price: 899,
        imageUrl: 'assets/images/bed.jpg'
      },
      {
        id: '5',
        name: 'Bibliothèque Scandinave',
        description: 'Bibliothèque spacieuse au design scandinave avec plusieurs niveaux de rangement.',
        price: 449,
        imageUrl: 'assets/images/bookshelf.jpg'
      },
      {
        id: '6',
        name: 'Bureau Ergonomique',
        description: 'Bureau ergonomique avec réglage en hauteur pour un confort de travail optimal.',
        price: 529,
        imageUrl: 'assets/images/desk.jpg'
      }
    ];
  }
} 