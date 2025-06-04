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
    title: 'kidsteps | ล็อกอิน'
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: DashboardComponent }],
    title: 'kidsteps | Dashboard'
  },
  {
    path: 'add-child',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: AddChildComponent }],
    title: 'kidsteps | เพิ่มรายชื่อ'
  },
  {
    path: 'list',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: ListChildComponent }],
    title: 'kidsteps | รายชื่อเด็ก'
  },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: DashboardComponent }],
    title: 'kidsteps | Dashboard'
  },
  {
    path: 'record',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: RecordComponent }],
    title: 'kidsteps | บันทึกการเจริญเติบโต'
  },
];
