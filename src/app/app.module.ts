import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


// Page Route
import { AppRoutingModule } from './app-routing.module';
import { LayoutsModule } from './layouts/layouts.module';
import { ToastrModule } from 'ngx-toastr';

// Laguage
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// component
import { AppComponent } from './app.component';
import { AuthlayoutComponent } from './authlayout/authlayout.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {AngularFireModule} from '@angular/fire/compat'
import { environment } from 'src/environments/environment.prod';





export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    AuthlayoutComponent
 
  ],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),

    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutsModule,
    ToastrModule.forRoot(),
    FormsModule,
   // imports: [FormsModule, ...otherModules],
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() =>
    initializeApp({
      "projectId": "school-runner-decf3",
      "appId": "1:231831769030:web:11d9098fd2b39035d72cc7",
      "databaseURL": "https://school-runner-decf3-default-rtdb.firebaseio.com",
      "storageBucket": "school-runner-decf3.appspot.com",
      "apiKey": "AIzaSyAGhQA94m5Ck8hJgCOS9c4Q_JlpZd6Nn90",
      "authDomain": "school-runner-decf3.firebaseapp.com",
      "messagingSenderId": "231831769030"
    })),
    
    
    //initializeApp({"projectId":"school-runner-decf3","appId":"1:231831769030:web:11d9098fd2b39035d72cc7","databaseURL":"https://school-runner-decf3-default-rtdb.firebaseio.com","storageBucket":"school-runner-decf3.appspot.com","apiKey":"AIzaSyAGhQA94m5Ck8hJgCOS9c4Q_JlpZd6Nn90","authDomain":"school-runner-decf3.firebaseapp.com","messagingSenderId":"231831769030"})),
    //initializeApp({"projectId":"school-runner-decf3","appId":"1:231831769030:web:11d9098fd2b39035d72cc7","databaseURL":"https://school-runner-decf3-default-rtdb.firebaseio.com","storageBucket":"school-runner-decf3.appspot.com","locationId":"us-central","apiKey":"AIzaSyAGhQA94m5Ck8hJgCOS9c4Q_JlpZd6Nn90","authDomain":"school-runner-decf3.firebaseapp.com","messagingSenderId":"231831769030"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
