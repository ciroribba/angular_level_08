import { SlicePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/components/interfaces/product.interface';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe],
  templateUrl: './product-card.html',
})
export class ProductCard {
  product = input.required<Product>();

  imageUrl = computed(() => `http://localhost:3000/api/files/product/${this.product().images[0]}`);
}
