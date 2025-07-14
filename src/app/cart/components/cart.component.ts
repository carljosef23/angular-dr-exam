import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ICart, ICartItem } from '../interface/cart.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.less',
  providers: [CurrencyPipe]
})
export class CartComponent implements OnInit {
  cart: ICart = { items: [], totalPrice: 0, couponCode: '' };
  couponInput: string = '';
  discount: number = 0;

  constructor(private cartService: CartService) {}
  
  ngOnInit(): void {
    this.cart = this.cartService.getCart();
  }

  applyCoupon() {
    if (this.couponInput === 'SAVE10') {
      this.discount = 0;
      this.cart.items.forEach(item => {
        if (item.subtotal >= 100) {
          const itemDiscount = Math.min(item.subtotal * 0.10, 50);
          (item as any).discountedSubtotal = item.subtotal - itemDiscount;
          this.discount += itemDiscount;
        } 
        else {
          (item as any).discountedSubtotal = undefined;
        }
      });
    } 
    else {
      this.discount = 0;
      this.cart.items.forEach(item => (item as any).discountedSubtotal = undefined);
    }

    this.cartService.saveCartToStorage();
  }

  get totalWithDiscount(): number {
    return this.cart.items
      .map(item => item.discountedSubtotal !== undefined ? item.discountedSubtotal : item.subtotal)
      .reduce((a, b) => a + b, 0);
  }
  
  confirmRemove(item: ICartItem) {
    if (confirm(`Remove "${item.name}" from cart?`)) {
      this.removeFromCart(item);
    }
  }

  removeFromCart(item: ICartItem) {
    this.cart.items = this.cart.items.filter(i => i.id !== item.id);
    this.cartService.getCart().items = this.cart.items;
    this.applyCoupon();

    this.cartService.saveCartToStorage(); 
  }

  
  updateCartQuantity(item: ICartItem, value: string | number){
    let qty = Number(value);
    if (isNaN(qty) || qty < 1) qty = 1;
      if (qty > 100) qty = 100;
        item.quantity = qty;
        item.subtotal = item.price * qty;
      this.applyCoupon();
      this.cartService.getCart().totalPrice = this.cart.items.reduce((sum, i) =>
      sum + (i.discountedSubtotal !== undefined ? i.discountedSubtotal : i.subtotal), 0     
    )
    this.cartService.saveCartToStorage();
  }
  
}
