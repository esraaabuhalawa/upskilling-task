import { Injectable } from '@angular/core';
import { User } from '../../models/user/user.interface';

/**
 * Reusable Search/Filter Service
 * Eliminates code duplication in components
 * Provides generic filtering logic
 */
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  /**
   * Filter array by search term across multiple fields
   * @param items - Array of items to filter
   * @param searchTerm - Search term
   * @param fields - Fields to search in
   */
  filterByTerm<T>(items: T[], searchTerm: string, fields: (keyof T)[]): T[] {
    if (!searchTerm.trim()) {
      return items;
    }

    const term = searchTerm.toLowerCase();
    return items.filter((item) =>
      fields.some((field) => {
        const value = item[field];
        return (
          value &&
          String(value).toLowerCase().includes(term)
        );
      })
    );
  }

  /**
   * Filter users by search term (convenience method)
   * @param users - Array of users
   * @param searchTerm - Search term
   */
  filterUsers(users: User[], searchTerm: string): User[] {
    return this.filterByTerm(users, searchTerm, [
      'firstName',
      'lastName',
      'email',
      'phone',
    ] as (keyof User)[]);
  }

  /**
   * Get paginated subset from array
   * @param items - Full array
   * @param page - Page number (0-indexed)
   * @param pageSize - Items per page
   */
  paginate<T>(items: T[], page: number, pageSize: number): T[] {
    const startIndex = page * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }

  /**
   * Sort array by field
   * @param items - Array to sort
   * @param field - Field to sort by
   * @param order - 'asc' or 'desc'
   */
  sortBy<T>(items: T[], field: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return items.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
