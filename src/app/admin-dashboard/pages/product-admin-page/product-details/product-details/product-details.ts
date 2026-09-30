import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '@products/components/interfaces/product.interface';
import { ProductCarousel } from '@products/components/product-carousel/product-carousel';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';
import { ProductService } from '@products/services/product.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'product-details',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails  implements OnInit{
  product = input.required<Product>();

  productService = inject(ProductService);
  fb = inject(FormBuilder);
  router = inject(Router);

  wasSaved = signal(false);

  productForm = this.fb.group(
    {
      title: ['', Validators.required],
      description: ['', Validators.required],
      slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      sizes: [[''], Validators.required],
      images:[[]],
      tags: [''],
      gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]]
    }
  )

  sizes= ['XS','S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(this.product() as any);
    //this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({tags: formLike.tags?.join(',')})
  }
  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes || [];
    if (currentSizes.includes(size)) {
      this.productForm.patchValue({sizes: currentSizes.filter(s => s !== size)});
    } else {
      this.productForm.patchValue({sizes: [...currentSizes, size]});
    }
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();    
    if(!isValid) return;

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags
      ?.toLowerCase()
      .split(',')
      .map(tag => tag.trim()) ?? []
    }

    if(this.product().id === 'new') {
    const product = await firstValueFrom(
      this.productService.createProduct(productLike)
    );   
    this.router.navigate(['/admin/products', product.id]);
    } else {

      await firstValueFrom(
        this.productService.updateProduct(this.product().id,productLike)
      );      
    }
    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);   
  }
}
