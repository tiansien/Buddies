import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

import { Observable, map } from 'rxjs';
import { ProfileService } from '../../services/api/profile.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private profileService: ProfileService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const userId = window.localStorage.getItem('userId');
    if (!userId) {
      this.router.navigate(['/']);
      return new Observable((subscriber) => subscriber.next(false));
    }

    return this.profileService.getHaveUserProfile(userId).pipe(
      map((hasProfile) => {
        if (!hasProfile) {
          this.router.navigate(['/']);
        }
        return hasProfile;
      })
    );
  }
}

