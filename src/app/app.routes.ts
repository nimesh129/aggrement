import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { ManageQuestionsComponent } from './admin/manage-questions/manage-questions.component';
import { SurveyManagementComponent } from './admin/survey-management/survey-management.component';
import { ClientFormComponent } from './client/client-form/client-form.component';
import { ClientSurveyComponent } from './client/client-survey/client-survey.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [authGuard],
    children: [
      { path: 'manage-questions', component: ManageQuestionsComponent },
      { path: 'survey-management', component: SurveyManagementComponent },
      // { path: 'other', component: OtherAdminTasksComponent } // Ensure this is included if needed
    ],
  },
  { path: 'client/form', component: ClientFormComponent },
  { path: 'client/survey', component: ClientSurveyComponent },
];