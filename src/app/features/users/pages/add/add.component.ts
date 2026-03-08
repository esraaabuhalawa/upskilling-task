import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload.component';
import { FormInputComponent } from "../../../../shared/components/form-input/form-input.component";
import { UsersService } from '../../../../core/services/users/users.service';
import { FormValidators } from '../../../../core/validators/form.validators';

@Component({
  selector: 'app-add',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    ProgressSpinner,
    ToastModule,
    ImageUploadComponent,
    FormInputComponent
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
  isViewMode: boolean = false;
  isSubmitting: boolean = false;
  existingPhotoUrl: string | null = null;

  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UsersService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService);

  ngOnInit(): void {
    this.initializeForm();

    // Subscribe to route params and url changes
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id');

      if (this.userId) {
        // Subscribe to url segments to detect edit/view
        this.route.url.subscribe((urlSegments) => {
          const path = urlSegments[1]?.path;

          if (path === 'edit') {
            this.isEditMode = true;
            this.isViewMode = false;
            this.loadUserData();
          } else if (path === 'view') {
            this.isViewMode = true;
            this.isEditMode = false;
            this.loadUserData();
          } else {
            this.isEditMode = false;
            this.isViewMode = false;
          }
        });
      } else {
        this.isEditMode = false;
        this.isViewMode = false;
      }
    });
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', FormValidators.name],
      lastName: ['', FormValidators.name],
      email: ['', FormValidators.email],
      phone: ['', FormValidators.phone],
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
      },
      error: (err: any) => {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load user data. Please try again.',
        });
        console.error('Error loading user:', err);
      }
    });
  }
  currentPreview: string | null = null;

  /** Called when the user picks a new image */
  onPhotoSelected(file: File): void {
    this.userForm.patchValue({ photo: file });
    // currentPreview is updated automatically via (previewChanged)
  }

  /** Called when the user clicks the remove (✕) button */
  onPhotoRemoved(): void {
    this.userForm.patchValue({ photo: null, photoUrl: null });
    this.currentPreview = null;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();

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
          // Global error
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
