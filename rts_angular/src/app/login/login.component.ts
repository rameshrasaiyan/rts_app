import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login-service';
import { HideComponentService } from '../Services/hide-component.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public myForm: FormGroup;
  hide = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private hideComponent: HideComponentService,
    private snackBar: MatSnackBar,
    private toastr: ToastrService
  ) {
    localStorage.removeItem('id_token');
    localStorage.removeItem('rts_user');
  }

  ngOnInit() {

    this.hideComponent.displayComponent = false;

    this.myForm = this.formBuilder.group({
      userEmail: ['', Validators.required],
      userPassword: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.hideComponent.displayComponent = true;
  }

  login(form: FormGroup) {
    this.toastr.clear();

    const user = {
      email: form.value.userEmail,
      password: form.value.userPassword
    };

    if (user.email === '' || user.email === null || user.password === '' || user.password === null
    ) {
      this.toastr.error('Username and password should not be empty', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }

    this.loginService.authenticateUser(user)
      .subscribe(
        data => {
          if (data.success) {
            this.loginService.storeUserData(data.token, data.user);
            this.toastr.success('You are now logged in', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            if (data.user.role === 'ADMIN') {
              this.router.navigate(['admin-dashboard']);
            } else if (data.user.role === 'ACC_MGR' || data.user.role === 'TL') {
              this.router.navigate(['mgr-dashboard']);
            } else if (data.user.role === 'RECRUITER') {
              this.router.navigate(['recruiter-dashboard']);
            }
          } else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
          }
        });
  }

}
