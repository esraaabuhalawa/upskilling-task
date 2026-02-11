import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private readonly httpClient = inject(HttpClient);

  //all Users Data
  getAllUsers(page: number = 0, limit: number = 5): Observable<any> {
    return this.httpClient.get(`https://dummyapi.io/data/v1/user?page=${page}&limit=${limit}`);
  }

  // Get User by Id
  getUserById(id: string): Observable<User> {
    return this.httpClient.get<User>(`${environment.baseUrl}user/${id}`);
  }

  // Add User
  createUser(data: any): Observable<User> {
    return this.httpClient.post<User>(`${environment.baseUrl}user/create`, data);
  }

  // Update User
  updateUser(id: string, data: any): Observable<any> {
    return this.httpClient.put<any>(`${environment.baseUrl}user/${id}`, data);
  }

  // Delete User
  deleteUser(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.baseUrl}user/${id}`);
  }
}
