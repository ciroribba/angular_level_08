import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCard } from '@products/components/product-card/product-card';
import { ProductService } from '@products/services/product.service';
import { Pagination } from '@shared/components/pagination/pagination';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard, Pagination],
  templateUrl: './gender-page.html',
})
export class GenderPage { 
  route = inject(ActivatedRoute);
  productService  = inject(ProductService)
  paginationService = inject(PaginationService);

  
  gender = toSignal(
    this.route.params.pipe(
      map(({gender}) => gender))
  );
  productsResource = rxResource({
    params: () => ({
      gender: this.gender(),
      offset: ((this.paginationService.currentPage() - 1) * 9),
    }),
  
    stream: ({ params }) =>
      this.productService.getProducts({
        gender: params.gender,
        offset: params.offset,
      }),
  });
}
