import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  async onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      await lastValueFrom(this.authService.login(username, password)).then(
        (res) => {
          if (res.token) {
            this.authService.setUserSession(res);
            this.router.navigate(['/']);
            console.log('Login successful');
          }
        },
      );
    }
  }
}
