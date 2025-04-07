import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { Observable, combineLatest } from 'rxjs';
import { map, take, filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold mb-4 text-gray-900">Votre Panier</h1>
      
      <div *ngIf="(cartItems$ | async)?.length; else emptyCart">
        <!-- Récapitulatif panier -->
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Liste d'articles -->
          <div class="flex-grow">
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <div class="p-4 border-b">
                <h2 class="text-lg font-semibold text-gray-900">Articles ({{cartItemCount$ | async}})</h2>
              </div>
              
              <ul class="divide-y divide-gray-200">
                <li *ngFor="let item of cartItems$ | async" class="p-4 flex flex-col sm:flex-row sm:items-center">
                  <div class="flex-shrink-0 h-24 w-24 bg-indigo-100 rounded-md flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
                    <svg class="h-12 w-12 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 12v-2a2 2 0 00-2-2h-2V5a2 2 0 00-2-2H10a2 2 0 00-2 2v3H6a2 2 0 00-2 2v2m16 0v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7m16 0h-2v4a1 1 0 11-2 0v-4H10v4a1 1 0 11-2 0v-4H6"/>
                    </svg>
                  </div>
                  
                  <div class="flex-grow">
                    <h3 class="text-lg font-medium text-gray-900">{{item.name}}</h3>
                    <p class="text-gray-600 mb-2">Prix unitaire: {{item.price}} €</p>
                    
                    <div class="flex items-center mt-2">
                      <button (click)="decrementQuantity(item.productId)" 
                              class="text-gray-600 focus:outline-none focus:text-indigo-600 p-1 border border-gray-300 rounded-md hover:bg-gray-100">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                      </button>
                      
                      <span class="mx-2 text-gray-700 w-8 text-center">{{item.quantity}}</span>
                      
                      <button (click)="incrementQuantity(item.productId)" 
                              class="text-gray-600 focus:outline-none focus:text-indigo-600 p-1 border border-gray-300 rounded-md hover:bg-gray-100">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div class="mt-4 sm:mt-0 flex items-center">
                    <span class="text-lg font-bold text-gray-900 mr-4">{{item.price * item.quantity}} €</span>
                    <button (click)="removeItem(item.productId)" 
                            class="text-red-500 hover:text-red-700 focus:outline-none">
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Récapitulatif -->
          <div class="lg:w-1/3">
            <div class="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2>
              
              <div class="space-y-3 mb-6">
                <div class="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{{totalPrice | async}} €</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span>{{shippingCost | async}} €</span>
                </div>
                <div class="border-t pt-3 flex justify-between font-semibold text-gray-900 text-lg">
                  <span>Total</span>
                  <span>{{grandTotal | async}} €</span>
                </div>
              </div>
              
              <button class="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Procéder au paiement
              </button>
              
              <p class="mt-4 text-sm text-gray-600 text-center">
                ou <a routerLink="/furniture" class="text-indigo-600 hover:text-indigo-800 font-medium">continuer vos achats</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <ng-template #emptyCart>
        <div class="bg-white rounded-lg shadow-md p-8 text-center">
          <div class="flex justify-center mb-4">
            <svg class="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-gray-900 mb-2">Votre panier est vide</h2>
          <p class="text-gray-600 mb-6">Il semble que vous n'ayez pas encore ajouté d'articles à votre panier.</p>
          <a routerLink="/furniture" 
             class="inline-block bg-indigo-600 text-white py-3 px-6 rounded-md font-medium hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Découvrir nos meubles
          </a>
        </div>
      </ng-template>
    </div>
  `
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  cartItemCount$: Observable<number>;
  totalPrice: Observable<number>;
  shippingCost: Observable<number>;
  grandTotal: Observable<number>;
  
  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cart$;
    this.cartItemCount$ = this.cartService.cartItemCount$;
    
    // Calculer le prix total
    this.totalPrice = this.cartService.cart$.pipe(
      map(items => items.reduce((total, item) => total + (item.price * item.quantity), 0))
    );
    
    // Calculer les frais de livraison (gratuit si > 200€)
    this.shippingCost = this.totalPrice.pipe(
      map(total => total > 200 ? 0 : 10)
    );
    
    // Calculer le total général
    this.grandTotal = combineLatest([this.totalPrice, this.shippingCost]).pipe(
      map(([total, shipping]) => total + shipping)
    );
  }
  
  ngOnInit(): void {
    // Ajouter des données de test si le panier est vide
    this.cartService.cart$.pipe(
      take(1),
      filter(items => items.length === 0)
    ).subscribe(() => {
      this.addTestData();
    });
  }
  
  incrementQuantity(productId: string): void {
    this.cartService.cart$.pipe(
      first()
    ).subscribe(items => {
      const item = items.find((i: CartItem) => i.productId === productId);
      if (item) {
        this.cartService.updateQuantity(productId, item.quantity + 1);
      }
    });
  }
  
  decrementQuantity(productId: string): void {
    this.cartService.cart$.pipe(
      first()
    ).subscribe(items => {
      const item = items.find((i: CartItem) => i.productId === productId);
      if (item && item.quantity > 1) {
        this.cartService.updateQuantity(productId, item.quantity - 1);
      }
    });
  }
  
  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }
  
  private addTestData(): void {
    // Ajouter quelques produits de test
    this.cartService.addToCart({
      id: '1',
      productId: '1',
      name: 'Canapé Moderne',
      price: 799,
      quantity: 1,
      imageUrl: 'assets/images/sofa.jpg'
    });
    
    this.cartService.addToCart({
      id: '2',
      productId: '3',
      name: 'Fauteuil Confort',
      price: 349,
      quantity: 2,
      imageUrl: 'assets/images/chair.jpg'
    });
  }
} 