import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  authSubscription: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService
      .getAuthenticated()
      .subscribe((auth) => {
        this.isLoading = false;
      });
  }
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  onLoginForm(loginform: NgForm) {

    if(loginform.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.loginUser(loginform.value.email, loginform.value.password);
  }
}
