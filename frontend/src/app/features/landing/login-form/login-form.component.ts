import {Component, EventEmitter, Input, Output} from '@angular/core';
import { PasswordResetService } from 'src/app/core/services/api/password-reset.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent {
  @Output() onSubmitLoginEvent = new EventEmitter<{
    login: string;
    password: string;
  }>();
  @Output() onSubmitRegisterEvent = new EventEmitter<{
    firstName: string;
    lastName: string;
    login: string;
    password: string;
  }>();
  @Output() onSubmitPasswordResetEvent = new EventEmitter<{
    email: string;
    code: string;
    newPassword: string;
  }>();

  activeTabIndex: number = 0;
  @Input() loginError: string = '';
  @Input() registerError: string = '';

  // Existing form fields
  firstName: string = '';
  lastName: string = '';
  login: string = '';
  password: string = '';

  // Reset password fields
  resetEmail: string = '';
  resetCode: string = '';
  newPassword: string = '';
  codeSent: boolean = false;
  resetRequestError: string = '';
  resetRequestSuccess: string = '';
  resetError: string = '';
  resetSuccess: string = '';

  onTabChange(index: number): void {
    this.activeTabIndex = index;
    // Reset all errors and success messages
    this.loginError = '';
    this.registerError = '';
    this.resetRequestError = '';
    this.resetRequestSuccess = '';
    this.resetError = '';
    this.resetSuccess = '';
    this.codeSent = false;
  }

  constructor(private passwordResetService: PasswordResetService) {}

  onSubmitLogin(): void {
    if (!this.login || !this.password) {
      this.loginError = 'Username and password are required';
    } else {
      this.onSubmitLoginEvent.emit({
        login: this.login,
        password: this.password,
      });
    }
  }

  onSubmitRegister(): void {
    if (!this.firstName || !this.lastName || !this.login || !this.password) {
      this.registerError = 'All fields are required';
    } else {
      this.onSubmitRegisterEvent.emit({
        firstName: this.firstName,
        lastName: this.lastName,
        login: this.login,
        password: this.password,
      });
    }
  }

  onSubmitResetRequest(): void {
    if (!this.resetEmail) {
      this.resetRequestError = 'Email is required';
      return;
    }
    // Call your password reset service here
    this.passwordResetService.requestPasswordReset(this.resetEmail).subscribe({
      next: (response) => {
        this.resetRequestSuccess = 'Reset code sent to your email';
        this.resetRequestError = '';
        this.codeSent = true;
      },
      error: (error) => {
        this.resetRequestError =
          error.error?.message || 'Failed to send reset code';
        this.resetRequestSuccess = '';
      },
    });
  }

  onSubmitPasswordReset(): void {
    if (!this.resetCode || !this.newPassword) {
      this.resetError = 'Reset code and new password are required';
      return;
    }

    this.passwordResetService
      .resetPassword(this.resetEmail, this.resetCode, this.newPassword)
      .subscribe({
        next: (response) => {
          this.resetSuccess = 'Password successfully reset';
          this.resetError = '';
          setTimeout(() => {
            this.activeTabIndex = 0; // Switch back to login tab
            this.codeSent = false;
          }, 2000);
        },
        error: (error) => {
          this.resetError = error.error?.message || 'Failed to reset password';
          this.resetSuccess = '';
        },
      });
  }
}