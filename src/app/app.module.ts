import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HighchartsChartModule } from 'highcharts-angular';
import { environment } from 'src/environments/environment';
import { AuthenticationModule } from './authentication/authentication.module';
import { CachingInterceptor } from './data/http-interceptors/caching-interceptor';
import { SetTokenRequestInterceptor } from './data/http-interceptors/set-token-request-interceptor';
import { AssetLayoutComponent } from './layout/asset-layout/asset-layout.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { ToastMessageComponent } from './layout/main-layout/components/toast-message/toast-message.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { OperationLayoutComponent } from './layout/operation-layout/operation-layout.component';
import { ProjectionLayoutComponent } from './layout/projection-layout/projection-layout.component';
import { StatsLayoutComponent } from './layout/stats-layout/stats-layout.component';
import { OperationModule } from './modules/operation/operation.module';
import { ProjectionModule } from './modules/projection/projection.module';
import { StatsModule } from './modules/stats/stats.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    ProjectionLayoutComponent,
    OperationLayoutComponent,
    ToastMessageComponent,
    StatsLayoutComponent,
    LoginLayoutComponent,
    AssetLayoutComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    SharedModule,
    ProjectionModule,
    OperationModule,
    StatsModule,
    HighchartsChartModule,
    AuthenticationModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideStorage(() => getStorage()),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SetTokenRequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
