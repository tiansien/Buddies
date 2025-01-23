import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Token needs to be retrieved from a service or storage
    const authToken = this.getToken();

    // Clone the request to add the new header.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });

    // Send the newly created request
    return next.handle(authReq);
  }

  private getToken(): string {
    // Ideally, the token is stored in local storage or a similar place.
    return localStorage.getItem('auth_token') || '';
  }
}
