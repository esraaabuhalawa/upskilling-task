import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private readonly httpClient = inject(HttpClient);

  // //all Users Data

  getAllUsers(page: number = 0, limit: number = 2): Observable<any> {
    return this.httpClient.get(`https://dummyapi.io/data/v1/user?page=${page}&limit=${limit}`);
  }

  //get User Data
  getUserById(id: string | null): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}user/${id}`)
  }
  //Add User
  createUser(data: object) {
    return this.httpClient.post(`${environment.baseUrl}user/create`, data)
  }

  //Update User
  updateUser(id: string, data: object) {
    return this.httpClient.put(`${environment.baseUrl}user/${id}`, data)
  }

  //delete User
  daleteUser(id: string) {
    return this.httpClient.delete(`${environment.baseUrl}user/${id}`)
  }
}
