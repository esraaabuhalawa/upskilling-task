import { UsersService } from './../../../core/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-add',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    ProgressSpinner,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent implements OnInit {
  userForm!: FormGroup;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  userId: string | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  isViewMode: boolean = false;
  ngOnInit(): void {
    this.initializeForm();

    // Check if we're in edit mode
    this.userId = this.route.snapshot.paramMap.get('id');

    if (this.userId) {
      const path = this.route.snapshot.url[1]?.path;
      if (path === 'edit') {
        this.isEditMode = true;
        this.loadUserData();
      } else if (path === 'view') {
        this.isViewMode = true;
        this.loadUserData();
      }
    }
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      photo: this.fb.control<File | null>(null)
    });
  }

  loadUserData(): void {
    if (!this.userId) return;

    this.userService.getUserById(this.userId).subscribe({
      next: (user: any) => {
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        });

        if (this.isViewMode) {
          this.userForm.disable();
        }
        // Load existing image
        // if (user.picture) {
        //   this.imagePreview = user.picture;
        // }
      },
      error: (err: any) => {
        console.error('Error loading user:', err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size should not exceed 5MB');
        return;
      }

      this.selectedFile = file;
      this.userForm.patchValue({ photo: file });

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.selectedFile = null;
    this.imagePreview = null;
    this.userForm.patchValue({ photo: null });
  }

  isSubmitting: boolean = false;

  onSubmit(): void {
    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
      this.messageService.add({
        severity: 'error',
        summary: 'Form Invalid',
        detail: 'Please fill all required fields correctly'
      });
      return;
    }

    this.isSubmitting = true;
    const userData: any = {
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      email: this.userForm.get('email')?.value,
      phone: this.userForm.get('phone')?.value
    };

    const request$ = this.isEditMode && this.userId
      ? this.userService.updateUser(this.userId, userData)
      : this.userService.createUser(userData);

    request$.subscribe({
      next: (res) => {
        this.messageService.add({
      severity: 'success',
      summary: this.isEditMode ? 'User Updated' : 'User Created',
      detail: this.isEditMode
        ? 'User updated successfully'
        : 'User created successfully',
      life: 2000
    });

    setTimeout(() => {
      this.router.navigate(['/users']);
    }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        const apiErrors = err.error?.data;

        if (apiErrors) {
          // Loop over each field error
          Object.keys(apiErrors).forEach(field => {
            const control = this.userForm.get(field);
            if (control) {
              control.setErrors({ apiError: apiErrors[field] });
            }
            // Optional: show toast for each field error
            this.messageService.add({
              severity: 'error',
              summary: `Error in ${field}`,
              detail: apiErrors[field]
            });
          });
        } else {
          // Error عام لو مش موجود apiErrors
          this.messageService.add({
            severity: 'error',
            summary: 'Request Failed',
            detail: 'Something went wrong. Please try again.'
          });
        }
      },
      complete: () => {
      this.isSubmitting = false;
    }
    });
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }

}
