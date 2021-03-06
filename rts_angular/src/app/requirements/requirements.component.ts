import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import * as moment from 'moment';
import { HideComponentService } from '../Services/hide-component.service';
import * as _ from 'underscore';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../Services/user.service';
import { Sort } from '@angular/material';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css'],
  providers: [LoggedUserService]
})
export class RequirementsComponent implements OnInit {
  private rtsUser: any;
  private rtsUserId: any;
  private requirements: any;
  private createdOn: any;
  private requirementsLength: any;
  private userRole: any;
  private requirementsForUser: any;
  private requirementsLengthForUser: any;
  private rtsCompanyId: any;
  private currentDate: Date;
  private requirementsForTeam: any;
  private requirementsLengthForTeam: any;
  private submittedRequirements: any;

  public myForm: FormGroup;
  private isStatus: boolean;
  private isTeam: boolean;
  private isClient: boolean;
  private requirementStatus: any;
  private teams: any;
  private clients: any;
  private isRecruiter: boolean;
  private userDetails: any;
  private teamUsers: any;
  private selectedRequirements: any;
  private startDate: any;
  private filter: any;
  private filteredRequirements: any;
  private sortedData: any;
  private isClientStatus: boolean;
  private selectedClientRequirements: any;
  private clientStatus: any;

  constructor(
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private hideComponent: HideComponentService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private ngProgress: NgProgress
  ) {
    this.hideComponent.displayComponent = true;
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsCompanyId = this.rtsUser.companyId;
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.currentDate = new Date(Date.now());
    this.submittedRequirements = [];
    this.selectedRequirements = [];
    this.teamUsers = [];
    this.requirementStatus = [
      { 'name': 'Open', 'value': 'Open' },
      { 'name': 'In-Progress', 'value': 'In-Progress' },
      { 'name': 'Closed', 'value': 'Closed' },
      { 'name': 'Draft', 'value': 'Draft' }
    ];
    this.filter = '';
  }

  ngOnInit() {
    this.ngProgress.start();
    this.hideComponent.displayComponent = true;

    this.myForm = this.formBuilder.group({
      fromDate: [''],
      toDate: ['']
    });

    this.startDate = this.currentDate;
    this.getCommonDetails();
    if (this.userRole === 'ADMIN') {
      this.getAllRequirements();
    } else if (this.userRole === 'TL' || this.userRole === 'ACC_MGR') {
      this.getAllRequirementsForTeam();
    } else if (this.userRole === 'RECRUITER' || this.userRole === 'TRAINEE') {
      this.getAllRequirementsForUser();
    }
  }

  filterItem(value) {
    const filteredItems = Object.assign([], this.filteredRequirements).filter(
      item => item.position.positionName.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    this.selectedRequirements = filteredItems;
    this.requirementsLength = this.selectedRequirements.length;
    this.sortedData = this.selectedRequirements.slice();
  }


  filterBy(value) {

    if (value === 'status') {
      this.isClientStatus = false;
      this.isStatus = true;
      this.isClient = false;
      this.isTeam = false;
      this.isRecruiter = false;
    } else if (value === 'team') {
      this.isClientStatus = false;
      this.isTeam = true;
      this.isStatus = false;
      this.isClient = false;
      this.isRecruiter = false;
    } else if (value === 'client') {
      this.isClient = true;
      this.isStatus = false;
      this.isTeam = false;
      this.isRecruiter = false;
    } else if (value === 'recruiter') {
      this.isClientStatus = false;
      this.isRecruiter = true;
      this.isTeam = false;
      this.isStatus = false;
      this.isClient = false;
    } else if (value === '') {
      this.isClientStatus = false;
      this.filter = '';
      this.isRecruiter = false;
      this.isTeam = false;
      this.isStatus = false;
      this.isClient = false;
    }
    this.selectedRequirementsDetails(this.requirements);
  }

  filterByDate() {

    this.filterBy('');
    this.ngProgress.start();

    if (this.userRole === 'ADMIN') {
      this.getAllRequirements();
    } else if (this.userRole === 'TL' || this.userRole === 'ACC_MGR') {
      this.getAllRequirementsForTeam();
    } else if (this.userRole === 'RECRUITER' || this.userRole === 'TRAINEE') {
      this.getAllRequirementsForUser();
    }

  }

  selectStatus(event) {
    if (event === 'selectAll') {
      this.selectedRequirements = this.requirements;
      this.selectedRequirementsDetails(this.selectedRequirements);
    } else {
      this.selectedRequirements = [];
      this.selectedRequirements = _.where(this.requirements, { status: event });
      this.selectedRequirementsDetails(this.selectedRequirements);
    }
  }

  selectTeam(event) {
    if (event === 'selectAll') {
      this.selectedRequirements = this.requirements;
      this.selectedRequirementsDetails(this.selectedRequirements);
    } else {
      this.selectedRequirements = [];
      this.selectedRequirements = _.where(this.requirements, { teamId: event });
      this.selectedRequirementsDetails(this.selectedRequirements);
    }
  }

  selectClient(event) {
    this.clientStatus = '';
    this.isClientStatus = true;
    if (event === 'selectAll') {
      this.selectedRequirements = this.requirements;
      this.selectedRequirementsDetails(this.selectedRequirements);
    } else {
      this.selectedRequirements = [];
      this.selectedRequirements = _.where(this.requirements, { clientId: event });
      this.selectedClientRequirements = this.selectedRequirements;
      this.selectedRequirementsDetails(this.selectedRequirements);
    }
  }

  selectClientStatus(event) {
    if (event === 'selectAll') {
      this.selectedRequirements = this.selectedClientRequirements;
      this.selectedRequirementsDetails(this.selectedRequirements);
    } else {
      this.selectedRequirements = [];
      this.selectedRequirements = _.where(this.selectedClientRequirements, { status: event });
      this.selectedRequirementsDetails(this.selectedRequirements);
    }
  }

  selectRecruiter(event) {
    if (event === 'selectAll') {
      this.selectedRequirements = this.requirements;
      this.selectedRequirementsDetails(this.selectedRequirements);
    } else {
      this.selectedRequirements = [];
      this.selectedRequirements = _.where(this.requirements, { allocationUserId: event });
      this.selectedRequirementsDetails(this.selectedRequirements);
    }
  }

  getCommonDetails() {
    const companyId = {
      userId: this.rtsUserId
    };

    this.requirementService.commonDetails(companyId)
      .subscribe(
        data => {
          if (data.success) {
            this.clients = data.clients;
            this.teams = data.teams;
            this.teamUsers = data.myTeamUser;
          }
        });
  }

  getAllRequirements() {
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');

    const userId = {
      companyId: this.rtsCompanyId,
      fromDate: fromDate,
      toDate: toDate
    };

    this.requirementService.requirementsDetails(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirementsDetails(data);
          }
        });
  }

  getAllRequirementsForUser() {
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');

    const userId = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    this.requirementService.requirementsDetailsForUser(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirementsDetails(data);
          }
        });
  }

  getAllRequirementsForTeam() {
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');

    const userId = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    this.requirementService.requirementsDetailsByTeam(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirementsDetails(data);
          }
        });
  }

  requirementsDetails(data) {
    this.ngProgress.done();
    this.requirements = data.requirements;
    this.filteredRequirements = this.requirements;
    this.selectedRequirements = this.requirements;
    this.selectedRequirements.reverse();
    this.requirementsLength = this.requirements.length;
    for (const require of this.requirements) {
      const diff = Math.floor(this.currentDate.getTime() - require.createdOn);
      const day = 1000 * 60 * 60 * 24;
      const days = Math.floor(diff / day);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 31);
      const years = Math.floor(months / 12);
      if (days < 7) {
        require.age = days + ' days ago';
      } else if (weeks < 4) {
        require.age = weeks + ' weeks ago';
      } else if (months < 12) {
        require.age = months + ' months ago';
      } else {
        require.age = years + ' years ago';
      }
    }
    this.sortedData = this.selectedRequirements.slice();
  }

  selectedRequirementsDetails(data) {
    this.selectedRequirements = data;
    this.filteredRequirements = this.selectedRequirements;
    this.requirementsLength = this.selectedRequirements.length;
    for (const require of this.selectedRequirements) {
      const diff = Math.floor(this.currentDate.getTime() - require.createdOn);
      const day = 1000 * 60 * 60 * 24;
      const days = Math.floor(diff / day);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 31);
      const years = Math.floor(months / 12);
      if (days < 7) {
        require.age = days + ' days ago';
      } else if (weeks < 4) {
        require.age = weeks + ' weeks ago';
      } else if (months < 12) {
        require.age = months + ' months ago';
      } else {
        require.age = years + ' years ago';
      }
    }
    this.sortedData = this.selectedRequirements.slice();
  }

  sortData(sort: Sort) {
    const data = this.selectedRequirements.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'positionName': return this.compare(a.position.positionName, b.position.positionName, isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        case 'positions': return this.compare(a.positionCount, b.positionCount, isAsc);
        case 'submittedCount': return this.compare(a.clientSubmissionCount, b.clientSubmissionCount, isAsc);
        case 'allocationByTeam': return this.compare(a.team.name, b.team.name, isAsc);
        case 'client': return this.compare(a.client.name, b.client.name, isAsc);
        case 'age': return this.compare(a.createdOn, b.createdOn, isAsc);
        default: return 0;
      }
    });
  }

  compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
