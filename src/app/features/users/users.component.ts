import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../core/services/users/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private readonly userService = inject(UsersService);

  allUsers = []
  usersSubscribe:Subscription | null = null;

  fetchUsers(){
    // this.isLoading = true;
    this.usersSubscribe = this.userService.getAllUsers().subscribe({
      next: (res) => {
      //  this.isLoading = false;
        //this.allUsers =
        console.log(res)
      },
      error: (err) => {
       // this.isLoading = false;
        console.log(err)
      }
    });
  }

  ngOnInit(): void {
    this.fetchUsers();
  }
}
