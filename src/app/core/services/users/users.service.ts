import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

   private readonly httpClient = inject(HttpClient);

  //all Users Data
  getAllUsers() {
    return this.httpClient.get(`${environment.baseUrl}user`)
  }

  //Add User
  addUser(data:object){
    return this.httpClient.post(`${environment.baseUrl}user/create`, data)
  }

  //Update User
  updateUser(id:string ,data:object){
    return this.httpClient.put(`${environment.baseUrl}user/${id}`, data)
  }

  //delete User
  daleteUser(id:string){
    return this.httpClient.delete(`${environment.baseUrl}user/${id}`)
  }
}
