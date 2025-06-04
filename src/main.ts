import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { AppTitleStrategy } from './app/title.strategy';
import { TitleStrategy } from '@angular/router';


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    provideRouter(routes)
  ]
}).catch((err) => console.error(err));