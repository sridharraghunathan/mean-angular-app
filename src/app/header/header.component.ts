import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean = false;
  authSubscription: Subscription;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getAuthState();
    this.authSubscription = this.authService
      .getAuthenticated()
      .subscribe((authenticated: boolean) => {
        this.userIsAuthenticated = authenticated;
      });
  }

  ngOnDestroy(): void {


    this.authSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
