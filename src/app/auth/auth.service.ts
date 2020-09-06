import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './auth.model';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment} from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnInit {
  private token: string;
  private authStatus: boolean;
  private isAuthenticated = new Subject<boolean>();
  private tokenTimer: any;
  userId: string;
   BACKEND_URL = environment.apiUrl + '/users/'

  constructor(public http: HttpClient, private router: Router) {}

  ngOnInit(): void {}

  getToken(): string {
    return this.token;
  }

  getUserId(): string {
    return this.userId;
  }

  getAuthenticated(): Observable<any> {
    return this.isAuthenticated.asObservable();
  }

  getAuthState() {
    return this.authStatus;
  }

  createUser(email: string, password: string) {
    const user: User = { email, password };
    this.http
      .post<{
        status: string;
        message: string;
      }>( `${this.BACKEND_URL}signup`, user)
      .subscribe(
        (res) => {
          this.router.navigate(['/']);
          this.isAuthenticated.next(true);
        },
        (error) => {
          this.isAuthenticated.next(false);
        }
      );
  }

  loginUser(email: string, password: string) {
    const user: User = { email, password };
    this.http
      .post<{
        status: string;
        message: string;
        token: string;
        expiresIn: number;
        userId: string;
      }>( `${this.BACKEND_URL}login`, user)
      .subscribe(
        (res) => {
          const token = res.token;
          this.token = token;
          if (this.token) {
            const expirationDuration = res.expiresIn;
            this.setTimer(expirationDuration);
            this.userId = res.userId;
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expirationDuration * 1000
            ); // we need set the time by getting current time + duration of expiration
            this.saveLocalStorage(this.token, expirationDate);
            this.authStatus = true;
            this.isAuthenticated.next(true);
          }
          this.router.navigate(['/']);
        },
        (error) => {
          this.isAuthenticated.next(false);
        }
      );
  }

  setTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    this.authStatus = false;
    this.isAuthenticated.next(false);
    this.token = null;
    this.userId = null;
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
    this.clearStorage();
  }

  autoAuthentication() {
    // we need get the expiration date
    const authInformation = this.getLocalStorage();
    if (!authInformation) {
      return;
    }
    // check if its expired or not
    const expiration =
      authInformation.expirationDate.getTime() - new Date().getTime();
    // this will in milliseconds
    if (expiration > 0) {
      // set the timer back where its left off
      this.setTimer(expiration / 1000);
      // set the token back and pass on the information
      this.isAuthenticated.next(true);
      this.authStatus = true;
      this.userId = authInformation.userId;
      this.token = authInformation.token;
    }
  }

  // Create LocalStorage to save the Token

  saveLocalStorage(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userId', this.userId);
  }

  // clear the LocalStorage
  clearStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
  }

  // Get the data from the LocalStorage
  getLocalStorage() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const userId = localStorage.getItem('userId');
    return { token, expirationDate: new Date(expirationDate), userId };
  }
}
