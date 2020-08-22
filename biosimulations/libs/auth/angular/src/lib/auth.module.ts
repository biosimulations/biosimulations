import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard } from './auth.guard';
import { AuthEnvironment } from './auth.environment';

@NgModule({
  imports: [CommonModule],
})
export class AuthModule {}
