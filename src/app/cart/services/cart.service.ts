import { Injectable } from '@angular/core';
import { ICart } from '../interface/cart.interface';
import { ICartItem } from '../interface/cart.interface';
import { IProduct } from '../../products/interface/product.interface';  

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart : ICart = {
    items: [],
    totalPrice: 0,
    couponCode: ''
  }

  constructor() { 
    this.loadCartFromStorage();
  }
  
  getCart(): ICart {
    return this.cart;
  }

  addToCart(product: IProduct, quantity: number): void {
    if (quantity <= 0) return;

    const existingItem = this.cart.items.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 0) + quantity;
      existingItem.subtotal = existingItem.price * existingItem.quantity;
    } 
    else {
      const cartItem: ICartItem = {
        ...product,
        quantity,
        subtotal: product.price * quantity
      };
      this.cart.items.push(cartItem);
    }
    this.updateTotalPrice();

    this.saveCartToStorage();
  }

  private updateTotalPrice() {
    this.cart.totalPrice = this.cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    }

  public saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  private loadCartFromStorage(): void {
    const stored = localStorage.getItem('cart');
    if (stored) {
      this.cart = JSON.parse(stored);
    }
  }
}

