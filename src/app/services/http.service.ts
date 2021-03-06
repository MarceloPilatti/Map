import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';

import { catchError, retry } from 'rxjs/operators';

import { environment  } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HTTPService {

  constructor(
    private http: HttpClient
  ) {}

  get(url, parameters = {}) {
    if (!url) {
      return;
    }

    const terramaUrl = environment.terramaUrl;
    const terramaUrlProd = 'http://www.terrama2.dpi.inpe.br/mpmt';

    if (!url.includes(terramaUrl) && !url.includes(terramaUrlProd)) {
      url = terramaUrl + url;
    }
    return this.http.get(url, {
      params: parameters
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  post(url, parameters = {}) {
    if (!url) {
      return;
    }
    const terramaUrl = environment.terramaUrl;
    if (!url.includes(terramaUrl)) {
      url = terramaUrl + url;
    }
    return this.http.post(url, {
      params: parameters
    }).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(`Error occured: ${error.message}`);
  }

}
