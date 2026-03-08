import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { User } from '../../models/user/user.interface';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
@Injectable({
  providedIn: 'root',
})

export class UsersService {

  private readonly httpClient = inject(HttpClient);
  private readonly BASE = `${environment.baseUrl}user`;

  //all Users Data
  getAllUsers(page: number = 0, limit: number = 5): Observable<PaginatedResponse<User>> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit);
    return this.httpClient.get<PaginatedResponse<User>>(this.BASE, { params });
  }

  // Get User by Id
  getUserById(id: string): Observable<User> {
    return this.httpClient.get<User>(`${this.BASE}/${id}`);
  }

  // Add User
  createUser(data: any): Observable<User> {
    return this.httpClient.post<User>(`${this.BASE}/create`, data);
  }

  // Update User
  updateUser(id: string, data: any): Observable<any> {
    return this.httpClient.put<any>(`${this.BASE}/${id}`, data);
  }

  // Delete User
  deleteUser(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.BASE}/${id}`);
  }
}
