import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl,  FormControl,  ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss',
})
export class FormInputComponent {
 /** Label text displayed above the input */
  @Input() label: string = '';

  /** The id/for attribute linking label → input */
  @Input() inputId: string = '';

  /** Input type: text | email | tel | password | number … */
  @Input() type: string = 'text';

  /** Placeholder text */
  @Input() placeholder: string = '';

  /** Whether the field is required (shows red asterisk) */
  @Input() required: boolean = false;

  /** The FormControl from the parent's FormGroup */
  @Input() control!: FormControl;

  /**
   * Validation error messages map.
   * Key   = error key (e.g. 'required', 'minlength', 'pattern', 'email')
   * Value = message string to display
   *
   * Example:
   *   [errorMessages]="{ required: 'Email is required', email: 'Invalid email' }"
   */
  @Input() errorMessages: Record<string, string> = {};

  get isInvalid(): boolean {
    return !!(this.control?.invalid && this.control?.touched);
  }

  get activeErrorMessage(): string | null {
    if (!this.control?.errors) return null;

    if (this.control.errors['apiError']) {
      return this.control.errors['apiError'];
    }

    for (const key of Object.keys(this.errorMessages)) {
      if (this.control.errors[key]) {
        return this.errorMessages[key];
      }
    }

    return null;
  }
}
