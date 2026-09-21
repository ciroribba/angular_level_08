import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductsResponse } from '@products/components/interfaces/product.interface';
import { Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ProductService {
    
    private http = inject(HttpClient);

    getProducts(): Observable<ProductsResponse[]> {
        return this.http.get<ProductsResponse[]>('http://localhost:3000/api/products')
        .pipe(tap((products) => console.log(products)));
    }
    
}