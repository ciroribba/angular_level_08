import { inject } from "@angular/core";
import { AuthService } from "@auth/services/auth.service";
import { HttpRequest } from "@angular/common/http";
import { HttpHandlerFn } from "@angular/common/http";

export function authInterceptor(
    req: HttpRequest<unknown>, 
    next: HttpHandlerFn) {
    
    const token = inject(AuthService).token();
  
    // Clone the request to add the authentication header.
    const newReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${token}`),
    });
    return next(newReq);
  }