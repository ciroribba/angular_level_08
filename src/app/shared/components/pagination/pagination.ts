import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.html',
})
export class Pagination {
  pages = input(0);
  currentPage = input<number>(1);
  activePage = linkedSignal(this.currentPage);// linkedsignal es un signal que se actualiza cuando el valor de la señal original cambia

  getPagesList = computed(() => {
    return Array.from({ length: this.pages() }, (_, index) => index + 1);
  })
}
