import { Component, OnInit, OnDestroy } from '@angular/core';
import { AxiosService } from '../../../core/axios/axios.service';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../../core/services/store/user/user.service';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../../core/services/api/profile.service';
import { PasswordResetService } from 'src/app/core/services/api/password-reset.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
})
export class ContentComponent implements OnInit, OnDestroy {
  private loginStatusSubscription!: Subscription;
  private profileStatusSubscription!: Subscription;
  loginStatus: boolean = false;
  profileStatus: boolean = false;
  loginError: string = '';
  registerError: string = '';
  private initialCheck: boolean = true;

  constructor(
    private axiosService: AxiosService,
    private router: Router,
    private userService: UserService,
    private profileService: ProfileService,
    private passwordResetService: PasswordResetService
  ) {}

  ngOnInit(): void {
    // Subscribe to login status changes
    this.loginStatusSubscription = this.userService
      .getLoginStatus()
      .subscribe((status) => {
        this.loginStatus = status;
        if (status) {
          // Check profile status whenever login status changes to true
          const userId = window.localStorage.getItem('userId');
          if (userId) {
            this.checkingProfileIsExist(userId);
          }
        }
      });

    // Check initial status if user is already logged in
    const userId = window.localStorage.getItem('userId');
    if (userId) {
      this.checkingProfileIsExist(userId);
    }
  }

  checkingProfileIsExist(id: string): void {
    this.profileService.getHaveUserProfile(id).subscribe({
      next: (data: boolean) => {
        this.profileStatus = data;

        // Only redirect on initial load if profile doesn't exist
        if (this.initialCheck && !data) {
          this.router.navigate(['/']);
        }
        this.initialCheck = false;
      },
      error: (error) => {
        console.error('Error loading profile details:', error);
        this.profileStatus = false;
        if (this.initialCheck) {
          this.router.navigate(['/']);
        }
      },
    });
  }

  onLogin(input: any): void {
    this.axiosService
      .request('POST', '/login', {
        login: input.login,
        password: input.password,
      })
      .then((response) => {
        this.axiosService.setAuthToken(response.data.token);
        if (response.data.id) {
          window.localStorage.setItem('userId', response.data.id);
          this.userService.setUserId(response.data.id);
        }
        if (response.data.name) {
          this.userService.setUserName(response.data.name);
        }
        if (response.data.token) {
          this.userService.setToken(response.data.token);
        }

        if (response.data.role === 'admin') {
          window.localStorage.setItem('role', response.data.role);
        } else {
          window.localStorage.setItem('role', 'user');
        }

        this.userService.setLoginStatus(true);
        this.checkingProfileIsExist(response.data.id);
      })
      .catch((error) => {
        // Set the login error message
        console.error('Error logging in:', error.response.data.message);
        this.loginError = error.response.data.message || 'Login failed';
      });
  }

  onRegister(input: any): void {
    this.axiosService
      .request('POST', '/register', {
        firstName: input.firstName,
        lastName: input.lastName,
        login: input.login,
        password: input.password,
      })
      .then((response) => {
        this.axiosService.setAuthToken(response.data.token);
        if (response.data.id) {
          window.localStorage.setItem('userId', response.data.id);
          this.userService.setUserId(response.data.id);
        }
        if (response.data.login) {
          this.userService.setUserName(response.data.login);
        }
        if (response.data.token) {
          this.userService.setToken(response.data.token);
        }

        if (response.data.role === 'admin') {
          window.localStorage.setItem('role', response.data.role);
        } else {
          window.localStorage.setItem('role', 'user');
        }

        this.userService.setLoginStatus(true);
        // After registration, profile status will be false by default
        this.profileStatus = false;
      })
      .catch((error) => {
        // Set the registration error message
        this.registerError =
          error.response.data.message || 'Registration failed';
      });
  }

  onProfileUpdated(): void {
    this.profileStatus = true; // Set profileStatus to true when the profile is updated
  }

  ngOnDestroy(): void {
    if (this.loginStatusSubscription) {
      this.loginStatusSubscription.unsubscribe();
    }
  }

  handlePasswordReset(input: any): void {
    this.passwordResetService
      .resetPassword(input.email, input.code, input.newPassword)
      .subscribe({
        next: (response) => {
          // Handle successful password reset
          this.loginError = ''; // Clear any existing login errors
          // You might want to show a success message or automatically switch to the login tab
        },
        error: (error) => {
          this.loginError =
            error.response?.data?.message || 'Password reset failed';
        },
      });
  }
}
