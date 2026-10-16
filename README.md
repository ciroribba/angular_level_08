# Teslo Shop

## Overview

Teslo Shop es el frontend de una tienda de ropa. Muestra el catálogo, el detalle de cada producto y un panel de administración para crear y editar productos, con inicio de sesión y control de acceso por rol.

El objetivo es practicar una aplicación Angular moderna: componentes standalone, detección de cambios sin Zone.js, estado con Signals, flujos HTTP con RxJS y una estructura organizada por features.

## Tech Stack

- Angular 20 (componentes standalone, `provideZonelessChangeDetection`)
- TypeScript
- RxJS
- Tailwind CSS 4
- DaisyUI
- Swiper

## Key Features

- Gestión de productos: listado paginado, filtro por género, detalle, alta y edición, incluida la carga de imágenes.
- Autenticación: login, token en `localStorage`, verificación de sesión y cierre de sesión. El panel de admin solo entra si el usuario tiene rol `admin`.
- Formularios reactivos: login y ficha de producto, con validaciones y mensajes de error reutilizables.
- Consumo de APIs: catálogo, detalle, alta, edición, subida de archivos y chequeo de sesión contra `http://localhost:3000/api`.
- Navegación entre páginas: tienda, detalle, login y administración, con rutas cargadas de forma diferida.

## Technical Concepts

### Angular Signals

El estado síncrono de la interfaz vive en Signals. `AuthService` guarda el estado de autenticación, el usuario y el token en signals privados y expone valores de solo lectura con `computed` (`authStatus`, `user`, `token`, `isAdmin`).

Las páginas convierten parámetros de ruta y de consulta en signals con `toSignal` (`PaginationService.currentPage`, género, id de producto). Las peticiones HTTP se conectan a la vista con `rxResource`: cuando cambian los parámetros, el recurso vuelve a pedir los datos. `linkedSignal` en la paginación sigue la página activa, y un `effect` en la edición redirige al listado si el producto no se puede cargar.

Implementation:
`src/app/auth/services/auth.service.ts`
`src/app/shared/components/pagination/pagination.service.ts`
`src/app/store-front/pages/home-page/home-page.ts`
`src/app/store-front/pages/gender-page/gender-page.ts`
`src/app/admin-dashboard/pages/product-admin-page/product-admin-page.ts`
`src/app/admin-dashboard/pages/product-admin-page/product-details/product-details/product-details.ts`

### RxJS

Los servicios devuelven `Observable`. `ProductService` usa `map`, `tap`, `switchMap` y `forkJoin` para subir imágenes en paralelo, armar el producto y recién entonces hacer el `POST` o el `PATCH`. También cachea listados y detalles en un `Map` para no repetir la misma petición.

`AuthService` usa `map` y `catchError` para traducir la respuesta del login y del check-status a un booleano, y deja el token y el usuario en signals. Los guards esperan ese observable con `firstValueFrom`. El interceptor de autenticación agrega el header `Authorization: Bearer` a cada request.

Implementation:
`src/app/products/services/product.service.ts`
`src/app/auth/services/auth.service.ts`
`src/app/auth/interceptors/auth.interceptor.ts`
`src/app/auth/guards/is-admin.guard.ts`
`src/app/auth/guards/not-authenticated.guard.ts`

### Dependency Injection

Los servicios se registran con `providedIn: 'root'` y los componentes los obtienen con `inject()`, sin constructor. Lo mismo hacen los guards funcionales (`CanMatchFn`) y el interceptor HTTP.

`app.config.ts` arma la aplicación: router, cliente HTTP con `fetch` y el interceptor de auth, y detección de cambios sin Zone.js. Los alias de TypeScript (`@auth`, `@products`, `@store-front`, `@shared`, `@utils`, `@dashboard`) separan esos imports del resto de la app.

Implementation:
`src/app/app.config.ts`
`src/app/products/services/product.service.ts`
`src/app/auth/services/auth.service.ts`
`src/app/shared/components/pagination/pagination.service.ts`

## Architecture

La aplicación arranca en `src/main.ts` y deja el enrutado en tres bloques con `loadChildren`:

- `store-front`: tienda pública (home, género, detalle y página no encontrada).
- `auth`: login y registro. El registro tiene ruta y layout; la página todavía no implementa el alta de usuario.
- `admin-dashboard`: listado y ficha de producto, protegidos por `IsAdminGuard`.

`products` concentra lo que comparten tienda y admin: interfaz de producto, servicio HTTP, tarjeta, tabla, carrusel y el pipe de imágenes. `shared` tiene paginación y la etiqueta de error de formulario. `utils` centraliza las reglas y los mensajes de validación.

- Organización por features, con layouts propios y rutas hijas.
- Separación de responsabilidades: la vista declara el recurso, el servicio habla con la API y los guards deciden si la ruta se puede activar.
- Componentes reutilizables: `ProductCard`, `ProductCarousel`, `ProductTable`, `Pagination` y `FormErrorLabel`.
- Servicios singleton para productos, sesión y página actual.

## Technical Decisions

**Signals para el estado de sesión y de la UI.** El usuario, el token, el rol de admin, el error del login y las imágenes temporales son valores que la plantilla lee muchas veces. Un signal (y un `computed` derivado) actualiza solo quien lo consume y encaja con la detección de cambios sin Zone.js. El token se lee en el interceptor con `token()` sin suscribirse a un observable.

**RxJS para el tráfico HTTP.** Login, listados, alta, edición y subida de archivos son flujos que se cancelan, se combinan y pueden fallar. `switchMap` espera a que terminen las imágenes antes de guardar el producto, y `forkJoin` sube varios archivos a la vez. `rxResource` une ese observable con los signals de la página: la vista reacciona a `value()`, `isLoading()` y `error()` sin un `subscribe` manual en cada componente.

**Caché en el servicio de productos.** Listados y detalles se guardan en memoria. Volver a una página ya visitada no dispara otra petición igual.

**Rutas diferidas y guards funcionales.** Tienda, auth y admin se cargan por separado. `NotAuthenticatedGuard` saca de `/auth` a quien ya tiene sesión. `IsAdminGuard` deja pasar solo si `check-status` confirma el rol `admin`.

## Getting Started

Requisitos: Node.js compatible con Angular 20 y la API de Teslo Shop corriendo en `http://localhost:3000/api`.

```bash
npm install
npm start
```

La app queda en `http://localhost:4200/`.

Rutas principales:

| Ruta | Qué muestra |
| --- | --- |
| `/` | Catálogo paginado |
| `/gender/:gender` | Productos de `men`, `women` o `kid` |
| `/product/:idSlug` | Detalle |
| `/auth/login` | Inicio de sesión |
| `/admin/products` | Listado de administración |
| `/admin/products/:id` | Alta (`new`) o edición |

Otros comandos:

```bash
npm run build
npm test
```

## Screenshots

Agregar capturas en `docs/screenshots/` y enlazarlas aquí:

- Home y filtro por género
- Detalle de producto
- Login
- Listado y edición en el panel de admin

## Live Demo

Todavía no hay una URL pública de demostración.