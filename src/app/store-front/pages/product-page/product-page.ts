import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@products/services/product.service';

@Component({
  selector: 'app-product-page',
  imports: [],
  templateUrl: './product-page.html',
})
export class ProductPage {
  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductService);

  productIdSlug: string = this.activatedRoute.snapshot.params['idSlug'];
  productResource = rxResource({
    stream: () => this.productService.getProductByIdSlug(this.productIdSlug),
  });
 }
