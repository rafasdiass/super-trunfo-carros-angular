import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as firebase from 'firebase/app';

firebase.initializeApp(environment.firebase);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
