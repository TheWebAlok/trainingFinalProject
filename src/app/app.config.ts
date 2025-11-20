import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { provideToastr } from 'ngx-toastr';
import { provideSpinnerConfig } from 'ngx-spinner';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

import { routes } from './app.routes';
import { environment } from '../environments/environment.development';

export const appConfig: ApplicationConfig = {
  providers: [
    // ✅ Angular Optimization
    provideZoneChangeDetection({ eventCoalescing: true }),

    // ✅ Router
    provideRouter(routes),

    // ✅ Angular Animations (Toastr, Spinner वगैरह के लिए जरूरी)
    provideAnimations(),

    // ✅ Notifications
    provideToastr(),

    // ✅ Spinner Config
    provideSpinnerConfig({ type: "ball-fussion" }),

    // ✅ Firebase Initialization
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    
    // ✅ Firebase Services
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),

    // ✅ HTTP Client
    provideHttpClient(),
  ]
};
