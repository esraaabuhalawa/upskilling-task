import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { APP_CONFIG } from '../../constants/app.constants';

/**
 * Configuration Service
 * Provides centralized access to API endpoints and app settings
 * Eliminates hardcoding and improves maintainability
 */
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private baseUrl = environment.baseUrl;

  constructor() {}

  /**
   * Get fully qualified API endpoint
   */
  getApiEndpoint(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  /**
   * Get pagination defaults
   */
  getPaginationConfig() {
    return APP_CONFIG.PAGINATION;
  }

  /**
   * Get placeholder image URL
   */
  getPlaceholderImage(width: number = 600, height: number = 400): string {
    return `${APP_CONFIG.IMAGES.PLACEHOLDER_URL}?text=No+Image`;
  }

  /**
   * Get system message
   */
  getMessage(category: 'SUCCESS' | 'ERROR' | 'CONFIRM', key: string): string {
    return (APP_CONFIG.MESSAGES[category] as any)[key] || '';
  }

  /**
   * Get API timeout
   */
  getApiTimeout(): number {
    return APP_CONFIG.API.TIMEOUT;
  }
}
