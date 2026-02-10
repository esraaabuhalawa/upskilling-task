import { UsersService } from './../../../core/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
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
    private userService :UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService :MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    // Check if we're in edit mode
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.isEditMode = true;
      this.loadUserData();
    }
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required,Validators.pattern('^[0-9]{10,15}$')]],
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

        // Load existing image
        // if (user.picture) {
        //   this.imagePreview = user.picture;
        // }
      },
      error: (err:any) => {
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
        detail: this.isEditMode ? 'User updated successfully' : 'User created successfully'
      });
      this.router.navigate(['/users']);
    },
    error: (err) => {
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
    }
  });
}


  //  onSubmit(): void {
  //   if (this.userForm.invalid) {
  //     // Mark all fields as touched
  //     Object.keys(this.userForm.controls).forEach(key => {
  //       this.userForm.get(key)?.markAsTouched();
  //     });

  //     // Toast Error for invalid form
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'Form Invalid',
  //       detail: 'Please fill all required fields correctly'
  //     });
  //     return;
  //   }

  //   // Build JSON object
  //   const userData: any = {
  //     firstName: this.userForm.get('firstName')?.value,
  //     lastName: this.userForm.get('lastName')?.value,
  //     email: this.userForm.get('email')?.value,
  //     phone: this.userForm.get('phone')?.value
  //   };

  //   if (this.isEditMode && this.userId) {
  //     // Update user
  //     this.userService.updateUser(this.userId, userData).subscribe({
  //       next: (res: any) => {
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'User Updated',
  //           detail: 'User updated successfully'
  //         });
  //         this.router.navigate(['/users']);
  //       },
  //       error: (err: any) => {
  //         console.error(err.error.data);
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Update Failed',
  //           detail: 'Could not update user. Please try again.'
  //         });
  //       }
  //     });
  //   } else {
  //     // Create user
  //     this.userService.createUser(userData).subscribe({
  //       next: (res: any) => {
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'User Created',
  //           detail: 'User created successfully'
  //         });
  //         this.router.navigate(['/users']);
  //       },
  //       error: (err: any) => {
  //         console.error(err.error.data);
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Creation Failed',
  //           detail: 'Could not create user. Please try again.'
  //         });
  //       }
  //     });
  //   }
  // }


  onCancel(): void {
    this.router.navigate(['/users']);
  }


}
