import { AbstractControl, ValidationErrors } from "@angular/forms";

export function PasswordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const repeatPassword = control.get('repeatPassword');

  if (password && repeatPassword && password.value !== repeatPassword.value) {
    return { passwordMismatch: true };
  }

  return null;
}