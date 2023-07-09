import { Injectable } from '@angular/core';
import { environment } from '../../environments/local-environment';

@Injectable({
  providedIn: 'root',
})

export class ApiConfigService {
  private baseUrl = environment.apiUrl;

  constructor() {}

  getBaseUrl(): string {
    return this.baseUrl;
  }
}
