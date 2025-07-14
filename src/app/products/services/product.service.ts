import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: any[] = []

  constructor(
    private HttpClient: HttpClient
  ) {    }

  public test() {
    console.log('nice')
  }

  public fetchMockProducts() {
    return this.HttpClient.get(environment.fetch_products_url);
  }

 
}
