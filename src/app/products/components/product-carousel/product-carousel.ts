import { Component, input, viewChild, ElementRef, AfterViewInit } from '@angular/core';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ProductImagePipe } from '@products/pipes/product-images.pipes';

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.html',
  styles: `
    .swiper {
    width: 100%;
    height: 500px;
    --swiper-navigation-color: rgb(0,204,255);
    --swiper-pagination-color: rgb(0,204,255);
  }
  `,
})
export class ProductCarousel implements AfterViewInit{
  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');
  ngAfterViewInit(): void {
    const element = this.swiperDiv().nativeElement;
    if(!element) return;
    console.log({element})
    console.log({images: this.images()})
    const swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,
      modules: [Pagination, Navigation],
    
      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },
    
      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    
      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}
