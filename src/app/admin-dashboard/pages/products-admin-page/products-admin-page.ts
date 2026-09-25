import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTable } from '@products/components/product-table/product-table';
import { ProductService } from '@products/services/product.service';
import { Pagination } from '@shared/components/pagination/pagination';
import { PaginationService} from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage {
  productService  = inject(ProductService);
  paginationService = inject(PaginationService);

  productsPerPage = signal<number>(10);
  
  productsResource = rxResource({
    params: () => ({
      offset: ((this.paginationService.currentPage() - 1) * 9),
      limit: this.productsPerPage(),
    }),
    stream: ({ params }) => this.productService.getProducts({ offset: params.offset, limit: params.limit }),
  });
}
