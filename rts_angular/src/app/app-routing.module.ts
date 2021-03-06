import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { RequirementsComponent } from './requirements/requirements.component';
import { SubmissionsComponent } from './submissions/submissions.component';
import { AddNewRequirementComponent } from './add-new-requirement/add-new-requirement.component';
import { EditRequirementComponent } from './edit-requirement/edit-requirement.component';
import { AddNewSubmissionsComponent } from './add-new-submissions/add-new-submissions.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { SubmissionByRequirementComponent } from './submission-by-requirement/submission-by-requirement.component';
import { ManageClientComponent } from './manage-client/manage-client.component';
import { AddClientComponent } from './add-client/add-client.component';
import { RecruiterEditSubmissionsComponent } from './recruiter-edit-submissions/recruiter-edit-submissions.component';
import { ManageCandidateComponent } from './manage-candidate/manage-candidate.component';
import { AddCandidateComponent } from './add-candidate/add-candidate.component';
import { GenerateReportComponent } from './generate-report/generate-report.component';
import { RequirementDetailComponent } from './requirement-detail/requirement-detail.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditCandidateComponent } from './edit-candidate/edit-candidate.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { AddTeamComponent } from './add-team/add-team.component';
import { ManageTeamComponent } from './manage-team/manage-team.component';
import { EditTeamComponent } from './edit-team/edit-team.component';
import { EditSubmissonComponent } from './edit-submisson/edit-submisson.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { UserSubmissionsComponent } from './user-submissions/user-submissions.component';
import { TeamSubmissionsComponent } from './team-submissions/team-submissions.component';
import { ClientRequirementsComponent } from './client-requirements/client-requirements.component';
import { DeleteTeamComponent } from './delete-team/delete-team.component';
import { TeamSubmissionStatusComponent } from './team-submission-status/team-submission-status.component';
import { ClientSubmissionStatusComponent } from './client-submission-status/client-submission-status.component';
import { RecruiterComparisonComponent } from './recruiter-comparison/recruiter-comparison.component';
import { TeamComparisonComponent } from './team-comparison/team-comparison.component';
import { AccMgrDashboardComponent } from './dashboard/acc-mgr-dashboard/acc-mgr-dashboard.component';
import { RecruiterDashboardComponent } from './dashboard/recruiter-dashboard/recruiter-dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


export const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: UserRegisterComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'requirements', component: RequirementsComponent },
  { path: 'submissions', component: SubmissionsComponent },
  { path: 'add-new-requirement', component: AddNewRequirementComponent },
  { path: 'edit-requirement/:id', component: EditRequirementComponent },
  { path: 'add-new-submission', component: AddNewSubmissionsComponent },
  { path: 'add-new-submission/:id', component: AddNewSubmissionsComponent },
  { path: 'manage-users', component: ManageUsersComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'submission-by-requirement/:id', component: SubmissionByRequirementComponent },
  { path: 'manage-client', component: ManageClientComponent },
  { path: 'add-client', component: AddClientComponent },
  { path: 'recruiter-edit-submissions/:id', component: RecruiterEditSubmissionsComponent },
  { path: 'manage-candidate', component: ManageCandidateComponent },
  { path: 'add-candidate', component: AddCandidateComponent },
  { path: 'generate-report', component: GenerateReportComponent },
  { path: 'requirement-detail/:id', component: RequirementDetailComponent },
  { path: 'edit-user/:id', component: EditUserComponent },
  { path: 'edit-client/:id', component: EditClientComponent },
  { path: 'edit-candidate/:id', component: EditCandidateComponent },
  { path: 'manage-team', component: ManageTeamComponent },
  { path: 'add-team', component: AddTeamComponent },
  { path: 'edit-team/:id', component: EditTeamComponent },
  { path: 'edit-submission/:id', component: EditSubmissonComponent },
  { path: 'user-submisson/:id/:fromDate/:toDate', component: UserSubmissionsComponent },
  { path: 'team-submisson/:id/:fromDate/:toDate', component: TeamSubmissionsComponent },
  { path: 'client-requirements/:id/:fromDate/:toDate', component: ClientRequirementsComponent },
  { path: 'team-submissions-status/:id/:status/:fromDate/:toDate', component: TeamSubmissionStatusComponent },
  { path: 'client-submissions-status/:id/:status/:fromDate/:toDate', component: ClientSubmissionStatusComponent },
  { path: 'recruiter-comparison/:id/:status/:fromDate/:toDate', component: RecruiterComparisonComponent },
  { path: 'team-comparison/:id/:status/:fromDate/:toDate', component: TeamComparisonComponent },
  { path: 'delete-team/:id', component: DeleteTeamComponent },
  { path: 'mgr-dashboard', component: AccMgrDashboardComponent },
  { path: 'tl-dashboard', component: AccMgrDashboardComponent },
  { path: 'recruiter-dashboard', component: RecruiterDashboardComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
];


// @NgModule({
//   imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
