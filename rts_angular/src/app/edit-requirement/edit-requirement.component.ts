import { Component, OnInit } from '@angular/core';
import { RequirementsService } from '../Services/requirements.service';
import { LoggedUserService } from '../Services/logged-user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'underscore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { UserService } from '../Services/user.service';
import { ClientService } from '../Services/client.service';
import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-edit-requirement',
  templateUrl: './edit-requirement.component.html',
  styleUrls: ['./edit-requirement.component.css'],
  providers: [LoggedUserService]
})
export class EditRequirementComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private requirementId: any;
  private requirements: any;
  private selectedRequirement: any;
  private requirementCreatedDate: any;
  private userDetails: any;
  private rtsCompanyId: any;
  private clients: any;

  public myForm: FormGroup;
  private requirementType: any;
  private immigration: any;
  private requirementByUser: any;
  private immigrationByUser: any;
  private isOtherPositionName: boolean;
  private isOtherAccountName: boolean;
  private technologies: any;
  private accounts: any;
  private positions: any;
  private teams: any;
  private requirementStatus: any;
  private editRequirement: any;
  private isOtherTechnology: boolean;
  private selectedTeam: any;
  private selectedTeamUsers: any;
  private userRole: any;
  private editTeam: boolean;
  private recruitersArray: any[];
  private selectedRecruites: any[];
  private isRecruiters: boolean;
  private selectedClient: any;
  private dropdownSettings: any;
  private selectedrecruitersArray: any;
  private accountName: any;

  constructor(private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private clientService: ClientService,
    private formBuilder: FormBuilder,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.requirementByUser = [];
    this.immigrationByUser = [];
    this.selectedTeamUsers = [];
    this.selectedRecruites = [];
    this.selectedrecruitersArray = [];
    this.recruitersArray = [];
    this.selectedRequirement = {};
    this.dropdownSettings = {};
    this.requirementType = ['C2C', 'C2H', 'FTE', 'TBD'];
    this.immigration = [
      { 'id': 'GC', 'value': 'GC', 'name': 'GC' },
      { 'id': 'CITIZEN', 'value': 'CITIZEN', 'name': 'CITIZEN' },
      { 'id': 'H1B', 'value': 'H1B', 'name': 'H1B' },
      { 'id': 'W2_1099', 'value': 'W2/1099', 'name': 'W2/1099' },
      { 'id': 'OPT_CPT', 'value': 'OPT/CPT', 'name': 'OPT/CPT' },
      { 'id': 'EAD', 'value': 'EAD', 'name': 'EAD' },
      { 'id': 'H4AD', 'value': 'H4AD', 'name': 'H4EAD' },
      { 'id': 'TN', 'value': 'TN', 'name': 'TN' },
    ];
    this.requirementStatus = [
      { 'name': 'Open', 'value': 'Open' },
      { 'name': 'In-Progress', 'value': 'In-Progress' },
      { 'name': 'Closed', 'value': 'Closed' }
    ];
  }

  ngOnInit() {
    this.ngProgress.start();

    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.requirementId = params['id'];
      });

    this.myForm = this.formBuilder.group({
      createdDate: [''],
      positionName: [''],
      otherPositionName: [''],
      otherAccountName: [''],
      clientName: [''],
      accountName: [''],
      status: [''],
      bankName: [''],
      priority: [''],
      location: [''],
      positionsCount: [''],
      technologies: [''],
      allocation: [''],
      clientRate: [''],
      sellingRate: [''],
      jobDescription: [''],
      team: [''],
      comments: [''],
      notes: [''],
      C2C: [''],
      C2H: [''],
      TBD: [''],
      FTE: [''],
      GC: [''],
      CITIZEN: [''],
      H1B: [''],
      W2_1099: [''],
      OPT_CPT: [''],
      EAD: [''],
      H4AD: [''],
      TN: [''],
      otherTechnology: [''],
      recruitersName: ['']
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'user',
      textField: 'firstName',
      enableCheckAll: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.getAllUsers();
    this.getCommonDetails();
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
            this.technologies = data.technologies;
            this.accounts = data.accounts;
            this.positions = data.positions;
            this.teams = data.teams;
            this.getAllRequirements();
          }
        });
  }

  getAllUsers() {
    const userId = {
      enteredBy: this.rtsUserId
    };

    this.userService.allUsers(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.userDetails = data.users;
          }
        });
  }

  getAllRequirements() {

    const userId = {
      companyId: this.rtsCompanyId
    };

    this.requirementService.requirementsDetails(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.requirements = data.requirements;
            this.selectedRequirement = _.findWhere(this.requirements, { requirementId: this.requirementId });
            this.requirementCreatedDate = moment(this.selectedRequirement.createdOn).format('MMM D, Y');
            this.requirementByUser = this.selectedRequirement.requirementType;
            this.immigrationByUser = this.selectedRequirement.immigrationRequirement;
            if (this.selectedRequirement.team !== undefined) {
              this.selectedTeam = _.findWhere(this.teams, { teamId: this.selectedRequirement.teamId });
              this.selectedTeamUsers.push(this.selectedTeam.leadUser);
              for (const user of this.selectedTeam.otherUsers) {
                this.selectedTeamUsers.push(user);
              }
            }
            this.isRecruiters = true;
            this.accountName = this.selectedRequirement.accountId;
            for (const recruiter of this.selectedRequirement.client.clientRecuriters) {
              this.recruitersArray.push({ user: recruiter.email, firstName: recruiter.name });
            }
            for (const value of this.selectedRequirement.clientRecuriters) {
              this.selectedrecruitersArray.push({ user: value.email, firstName: value.name });
            }
            for (const value of this.requirementByUser) {
              if (value === 'C2C') {
                this.myForm.controls.C2C.setValue('C2C');
              } else if (value === 'C2H') {
                this.myForm.controls.C2H.setValue('C2H');
              } else if (value === 'FTE') {
                this.myForm.controls.FTE.setValue('FTE');
              } else if (value === 'TBD') {
                this.myForm.controls.TBD.setValue('TBD');
              }
            }
            for (const value of this.immigrationByUser) {
              if (value === 'GC') {
                this.myForm.controls.GC.setValue('GC');
              } else if (value === 'CITIZEN') {
                this.myForm.controls.CITIZEN.setValue('CITIZEN');
              } else if (value === 'H1B') {
                this.myForm.controls.H1B.setValue('H1B');
              } else if (value === 'W2/1099') {
                this.myForm.controls.W2_1099.setValue('W2/1099');
              } else if (value === 'OPT/CPT') {
                this.myForm.controls.OPT_CPT.setValue('OPT/CPT');
              } else if (value === 'EAD') {
                this.myForm.controls.EAD.setValue('EAD');
              } else if (value === 'H4AD') {
                this.myForm.controls.H4AD.setValue('H4AD');
              } else if (value === 'TN') {
                this.myForm.controls.TN.setValue('TN');
              }
            }
          }
        });
  }


  getCheckedRequirementType(type) {
    if (this.requirementByUser.indexOf(type) === -1) {
      this.requirementByUser.push(type);
    } else {
      this.requirementByUser.splice(this.requirementByUser.indexOf(type), 1);
    }
  }

  getCheckedImmigrationValue(data) {
    if (this.immigrationByUser.indexOf(data.value) === -1) {
      this.immigrationByUser.push(data.value);
    } else {
      this.immigrationByUser.splice(this.immigrationByUser.indexOf(data.value), 1);
    }
  }

  changePositionName(event) {
    if (event === 'other') {
      this.isOtherPositionName = true;
      this.myForm.controls.otherPositionName.setValue('');
    } else {
      this.myForm.controls.otherPositionName.setValue(event);
      this.isOtherPositionName = false;
    }
  }

  changeAccountName(event) {
    if (event === 'other') {
      this.isOtherAccountName = true;
      this.myForm.controls.otherAccountName.setValue('');
    } else {
      this.myForm.controls.otherAccountName.setValue(event);
      this.isOtherAccountName = false;
    }
  }

  addTechnology(event) {
    if (event === 'other') {
      this.isOtherTechnology = true;
      this.myForm.controls.otherTechnology.setValue('');
    } else {
      this.myForm.controls.otherTechnology.setValue(event);
      this.isOtherTechnology = false;
    }
  }

  selectTeam(event) {
    if (event !== '') {
      this.selectedTeamUsers = [];
      this.selectedTeam = _.findWhere(this.teams, { teamId: event });
      this.selectedTeamUsers.push(this.selectedTeam.leadUser);
      for (const user of this.selectedTeam.otherUsers) {
        this.selectedTeamUsers.push(user);
      }
    }
  }

  getClientRecruiters(event) {
    this.recruitersArray = [];
    this.selectedRecruites = [];
    if (event !== undefined) {
      this.isRecruiters = true;
      this.selectedClient = _.findWhere(this.clients, { clientId: event });
      for (const recruiter of this.selectedClient.clientRecuriters) {
        this.recruitersArray.push({ user: recruiter.email, firstName: recruiter.name });
      }
    }
    this.deSelectAll();
  }

  deSelectAll() {
    this.myForm.controls.recruitersName.setValue('');
  }

  updateRequirement(form: FormGroup) {
    this.ngProgress.start();

    this.selectedRecruites = [];
    for (const recruiter of this.selectedrecruitersArray) {
      this.selectedRecruites.push({ email: recruiter.user });
    }

    const requirement: any = {
      priority: form.value.priority,
      location: form.value.location,
      requirementType: this.requirementByUser,
      immigrationRequirement: this.immigrationByUser,
      positionCount: parseInt(form.value.positionsCount, 0),
      status: form.value.status,
      enteredBy: this.rtsUserId,
      clientId: form.value.clientName,
      allocationUserId: form.value.allocation,
      clientRate: form.value.clientRate,
      sellingRate: form.value.sellingRate,
      jobDescription: form.value.jobDescription,
      requirementId: this.requirementId,
      teamId: form.value.team,
      note: form.value.notes,
      client: {
        clientId: form.value.clientName,
        clientRecuriters: this.selectedRecruites
      }
    };

    if (form.value.positionName === 'other') {
      requirement.position = {
        positionName: form.value.otherPositionName
      };
    } else {
      requirement.positionId = form.value.positionName;
    }

    if (form.value.accountName === 'other') {
      requirement.account = {
        accountName: form.value.otherAccountName
      };
    } else {
      requirement.accountId = form.value.accountName;
    }

    if (form.value.technologies === 'other') {
      requirement.technology = [{
        technologyName: form.value.otherTechnology
      }];
    } else {
      requirement.technology = [{
        technologyId: form.value.technologies
      }];
    }

    this.editRequirement = requirement;

    this.requirementService.updateRequirement(this.editRequirement)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('Requirement Update successfully', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.ngProgress.done();
            this.router.navigate(['requirements']);

          } else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.ngProgress.done();
          }
        });
  }

}
