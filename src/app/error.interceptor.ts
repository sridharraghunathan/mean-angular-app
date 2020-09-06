import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { ErrorComponent } from './error/error.component';

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {
  // EVERY OUTGOING REQUEST WILL WATCH THE STATUS OF THE REQUEST IF THERE IS AN ERROR THIS WILL

  constructor(private matDialog: MatDialog) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errMessage = 'An Unknown Error Occured';
        if (error.error.message) {
          errMessage = error.error.message;
        }

        this.matDialog.open(ErrorComponent, { data: { message: errMessage } });

        // below is Observable Stream
        return throwError(error);
      })
    );
  }
}
