import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../core/services/users/users.service';
import { Subscription } from 'rxjs';
// import { ButtonModule } from 'primeng/button';
// import { TableModule } from 'primeng/table';
// import { InputGroupModule } from 'primeng/inputgroup';
// import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
//import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule} from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-users',
  imports: [
   // ButtonModule,
    //TableModule,
  //  InputGroupModule,
    FormsModule,
   // InputTextModule,
   // MenuModule,
    ConfirmDialogModule,
    ToastModule,
    PaginatorModule,
    RouterLink,
    ProgressSpinnerModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private readonly userService = inject(UsersService);
  products = [];
  searchValue: string = '';
  allUsers: any = [];
  usersSubscribe: Subscription | null = null;
  selectedUser: any;

  constructor(private router: Router,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) { }


  first: number = 0;
page: number = 0;
rows: number = 5;
limit: number = 5;
totalRecords: number = 0;
filteredUsers: any[] = [];
displayedUsers: any[] = [];
isLoading: boolean = false;

// Fetch all users once for frontend filtering
fetchUsers() {
  this.isLoading = true;
  this.userService.getAllUsers(0, 50).subscribe({ // Fetch max users
    next: (res: any) => {
      this.allUsers = res.data;
      this.filteredUsers = res.data;
      this.totalRecords = res.data.length;
      this.updateDisplayedUsers();
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.isLoading = false;
      console.log(err);
    }
  });
}

// Search from frontend
onSearch() {
  if (!this.searchValue.trim()) {
    this.filteredUsers = this.allUsers;
  } else {
    const searchTerm = this.searchValue.toLowerCase();
    this.filteredUsers = this.allUsers.filter((user:any) =>
      user.firstName?.toLowerCase().includes(searchTerm) ||
      user.lastName?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm)
    );
  }

  this.totalRecords = this.filteredUsers.length;
  this.first = 0; // Reset to first page
  this.updateDisplayedUsers();
}

  // Update displayed users based on pagination
updateDisplayedUsers() {
  const startIndex = this.first;
  const endIndex = this.first + this.rows;
  this.displayedUsers = this.filteredUsers.slice(startIndex, endIndex);
}

// Page change - NO API call, just slice array
onPageChange(event: any) {
  this.first = event.first;
  this.rows = event.rows;
  this.updateDisplayedUsers(); // Just update the displayed slice
}
  confirmDelete(user: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${user.firstName}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.daleteUser(user.id).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: `${user.firstName} deleted successfully`
            });

            this.fetchUsers();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete user'
            });
            console.error(err);
          }
        });

      }
    });
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  ngOnDestroy(): void {
    this.usersSubscribe?.unsubscribe();
  }
}
