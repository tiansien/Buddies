import { Component } from '@angular/core';
import { AxiosService } from 'src/app/core/axios/axios.service';
import { PasswordResetService } from 'src/app/core/services/api/password-reset.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  email: string = '';
  resetCode: string = '';
  newPassword: string = '';
  codeSent: boolean = false;
  message: string = '';
  error: string = '';

  constructor(private passwordResetService: PasswordResetService) {}

  requestReset() {
    this.passwordResetService.requestPasswordReset(this.email).subscribe({
      next: (response) => {
        this.message = 'Reset code sent to your email';
        this.codeSent = true;
        this.error = '';
      },
      error: (error) => {
        this.error = error.error.message || 'Failed to send reset code';
        this.message = '';
      },
    });
  }

  resetPassword() {
    this.passwordResetService
      .resetPassword(this.email, this.resetCode, this.newPassword)
      .subscribe({
        next: (response) => {
          this.message = 'Password successfully reset';
          this.error = '';
          // Redirect to login page after successful reset
          setTimeout(() => {
            // Add your router navigation here
          }, 2000);
        },
        error: (error) => {
          this.error = error.error.message || 'Failed to reset password';
          this.message = '';
        },
      });
  }
}
