import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private excludedUrls = ['/login', '/register'];

  constructor(private router: Router, private route: ActivatedRoute) {}

  private isExcludedUrl(url: string): boolean {
    return this.excludedUrls.some((excludedUrl) => url.includes(excludedUrl));
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.isExcludedUrl(request.url)) {
      return next.handle(request);
    }

    const token = localStorage.getItem('sessionToken');
    const currentRoute = this.router.url;

    if (!token) {
      if (this.excludedUrls.includes(currentRoute)) {
        this.router.navigate([currentRoute]);
      }
      return throwError(
        () =>
          new HttpErrorResponse({ error: 'No token available', status: 401 })
      );
    }

    const authRequest = request.clone({
      setHeaders: {
        authorization: token,
      },
    });
    return next.handle(authRequest);
  }
}
