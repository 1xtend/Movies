import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MediaInterceptor } from './shared/interceptors/http.interceptor';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { SliderModule } from './slider/slider.module';

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyB-FVP7-MH1QnKM7axHhYQeubxsXDHUt_Q',
  authDomain: 'vmtv-cebe5.firebaseapp.com',
  projectId: 'vmtv-cebe5',
  storageBucket: 'vmtv-cebe5.appspot.com',
  messagingSenderId: '878623284064',
  appId: '1:878623284064:web:48b40134400552b7859c05',
};

const app = initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    SliderModule,
  ],
  exports: [SharedModule, MaterialModule],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MediaInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
})
export class AppModule {}
