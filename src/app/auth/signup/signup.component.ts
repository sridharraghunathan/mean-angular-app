import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
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

  onSignUpForm(signup: NgForm) {
    if (signup.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.createUser(signup.value.email, signup.value.password);
  }
}
