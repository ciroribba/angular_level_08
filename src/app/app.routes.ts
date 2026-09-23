import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.route'),
        canMatch: [
            // () => {
            //     return false; // si es falso no se va a renderizar nada de la ruta
            // },
            NotAuthenticatedGuard],
    },
    {
        path: '',
        loadChildren: () => import('./store-front/store-front.routes'),
    },
];
