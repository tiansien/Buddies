import { Injectable } from '@angular/core';
// import { se } from 'date-fns/locale';
// import { se } from 'date-fns/locale';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private loginStatus$ = new BehaviorSubject<boolean>(false);
  private userId$ = new BehaviorSubject<string | null>(null);
  private userName$ = new BehaviorSubject<string | null>(null);
  private token$ = new BehaviorSubject<string | null>(null);
  private profileStatus$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  private isTokenValid(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }

  getLoginStatus(): Observable<boolean> {
    const isLoggedIn = this.isTokenValid();
    this.loginStatus$.next(isLoggedIn);
    return this.loginStatus$.asObservable();
  }

  setLoginStatus(status: boolean): void {
    this.loginStatus$.next(status);
  }

  setUserId(userId: string): void {
    this.userId$.next(userId);
  }

  getUserId() {
    return this.userId$.asObservable();
  }

  setUserName(userName: string): void {
    this.userName$.next(userName);
  }

  getProfileStatus(): Observable<boolean> {
    return this.profileStatus$.asObservable();
  }

  setProfileStatus(status: boolean): void {
    this.profileStatus$.next(status);
  }

  getUserName() {
    return this.userName$.asObservable();
  }

  setToken(token: string): void {
    this.token$.next(token);
  }

  getToken() {
    return this.token$.asObservable();
  }

  clearUserData(): void {
    this.userId$.next(null);
    this.userName$.next(null);
    this.token$.next(null);
    this.profileStatus$.next(false);
  }
}
