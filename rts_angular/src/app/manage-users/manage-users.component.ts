import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
  providers: [LoggedUserService]
})
export class ManageUsersComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private userDetails: any;
  private userLength: any;
  private rtsCompanyId: any;

  constructor(
    private loggedUser: LoggedUserService,
    private router: Router,
    private userService: UserService,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
  }

  ngOnInit() {
    this.ngProgress.start();
    this.getAllUser();
  }

  getAllUser() {
    const userId = {
      companyId: this.rtsCompanyId
    };

    this.userService.allUsers(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.userDetails = data.users;
            this.userLength = this.userDetails.length;
          }
        });

  }

}
