import { Validators } from '@angular/forms';
import { VALIDATION_RULES } from '../../core/constants/validation.constants';

export const FormValidators = {
  name: [Validators.required, Validators.minLength(VALIDATION_RULES.NAME_MIN_LENGTH)],

  email: [Validators.required, Validators.email],

  phone: [
    Validators.required,
    Validators.pattern(VALIDATION_RULES.PHONE_REGEX)
  ]
};
