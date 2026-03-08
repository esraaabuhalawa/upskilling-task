import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { APP_CONFIG } from '../../../../core/constants/app.constants';
import { User } from '../../../../core/models/user/user.interface';
import { UsersService } from '../../../../core/services/users/users.service';

@Component({
  selector: 'app-users',
  imports: [
    FormsModule,
    ConfirmDialogModule,
    ToastModule,
    PaginatorModule,
    RouterLink,
    ProgressSpinnerModule,
    UserCardComponent,
    EmptyStateComponent,
    SearchInputComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})

export class UsersComponent implements OnInit {
  private readonly userService = inject(UsersService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly messageService = inject(MessageService);

  protected readonly config = {
    messages: APP_CONFIG.MESSAGES,
    searchPlaceholder: APP_CONFIG.SEARCH.PLACEHOLDER,
    imageErrorPlaceholder: APP_CONFIG.IMAGES.PLACEHOLDER_URL,
  };

  searchValue: string = '';
  allUsers: User[] = [];
  page: number = 0;
  usersSubscribe: Subscription | null = null;
  selectedUser: User | null = null;
  first: number = APP_CONFIG.PAGINATION.DEFAULT_PAGE;
  rows: number = APP_CONFIG.PAGINATION.DEFAULT_ROWS;
  limit: number = APP_CONFIG.PAGINATION.DEFAULT_LIMIT;
  totalRecords: number = 0;
  filteredUsers: User[] = [];
  displayedUsers: User[] = [];
  isLoading: boolean = false;

  // Fetch all users once for frontend filtering
  fetchUsers(): void {
    this.isLoading = true;
    const allUsers: User[] = [];

    const fetchPage = () => {
      this.userService.getAllUsers(this.page, this.limit).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          allUsers.push(...res.data);
          const totalPages = Math.ceil(res.total / this.limit);
          this.page++;
          if (this.page < totalPages) {
            fetchPage(); // fetch next page
          } else {
            // All pages fetched
            this.allUsers = [...allUsers];
            this.filteredUsers = [...allUsers];
            this.totalRecords = allUsers.length;
            this.updateDisplayedUsers();
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.config.messages.ERROR.FETCH_FAILED,
          });
        }
      });
    };

    fetchPage();
  }

  // Check if there are users to display
  get hasUsers(): boolean {
    return this.displayedUsers?.length > 0;
  }

  //Filter users based on search input - frontend filtering
  filterUsers(): void {
    const searchTerm = this.searchValue.trim().toLowerCase();

    if (!searchTerm) {
      this.filteredUsers = [...this.allUsers];
    } else {
      this.filteredUsers = this.allUsers.filter((user: User) =>
        [user.firstName, user.lastName]
          .some(field => field?.toLowerCase().includes(searchTerm))
      );
    }

    this.totalRecords = this.filteredUsers.length;
    this.first = 0; // Reset paginator to first page
    this.updateDisplayedUsers();
  }

  // Called from search input component
  onSearch(value: string): void {
    this.searchValue = value;
    this.filterUsers();
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

  //Delete Message
  confirmDelete(user: any) {
    this.confirmationService.confirm({
      message: this.config.messages.CONFIRM.DELETE_USER,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(user.id).subscribe({
          next: (res) => {
            console.log(res);
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: this.config.messages.SUCCESS.USER_DELETED
            });

            this.fetchUsers();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: this.config.messages.ERROR.DELETE_FAILED
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
