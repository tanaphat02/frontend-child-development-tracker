import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { HomepageComponent } from './component/homepage/homepage.component';
import { MainLayoutComponent } from './component/main-layout/main-layout.component';
import { ListChildComponent } from './component/list-child/list-child.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { RecordComponent } from './component/record/record.component';
import { AddChildComponent } from './component/add-child/add-child.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: DashboardComponent }],
  },
  {
    path: 'add-child',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: AddChildComponent }],
  },
  {
    path: 'list',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: ListChildComponent }],
  },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: DashboardComponent }],
  },
  {
    path: 'record',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: RecordComponent }],
  },
];
