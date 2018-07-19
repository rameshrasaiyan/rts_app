import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
  providers: [LoggedUserService]
})
export class ManageUsersComponent implements OnInit {

  rtsUser: any;
  rtsUserId: any;
  userDetails: any;
  userLength: any;

  constructor(
    private loggedUser: LoggedUserService,
    private router: Router,
    private userService: UserService
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
  }

  ngOnInit() {
    this.getAllUser();
  }

  getAllUser() {
    const userId = {
      enteredBy: this.rtsUserId
    };

    console.log(userId);
    this.userService.allUsers(userId)
      .subscribe(
        data => {
          console.log(data);
          if (data.success) {
            this.userDetails = data.users;
            this.userLength = this.userDetails.length;
          }
        });

  }

}