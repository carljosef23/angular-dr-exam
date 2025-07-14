import { Component,OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { IProduct } from '../interface/product.interface';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../cart/services/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.less',
  providers: [CurrencyPipe],
})
export class ProductComponent implements OnInit {
  public products: IProduct[] = [];

  constructor(
    private ProductService: ProductService,
    private CartService: CartService 
  ) {}   

  ngOnInit(): void {
    this.ProductService.fetchMockProducts().subscribe({
      next: (response: any) => {
        this.products = response.products;
        console.log('Products fetched successfully', this.products);
      },
      error: (error:any) => {
        console.log('Error Fetching Products', error);
      }
    })
  }
  
  public addToCart(quantity: number, product: IProduct) {
    this.CartService.addToCart(product, quantity);
    console.log('Current cart:', this.CartService.getCart());
    alert(`Added ${quantity} items to cart`);
}
}

