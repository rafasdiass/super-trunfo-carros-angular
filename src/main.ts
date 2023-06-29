import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBE2gfpsz8oZBOE61mn4RpdNjT9qdkrhDI",
  authDomain: "supertrunfopokemon.firebaseapp.com",
  projectId: "supertrunfopokemon",
  storageBucket: "supertrunfopokemon.appspot.com",
  messagingSenderId: "991015289846",
  appId: "1:991015289846:web:ac91cc4c3ed086aa76fdd7",
  measurementId: "G-1VL1XMK8KL"
};

initializeApp(firebaseConfig);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
