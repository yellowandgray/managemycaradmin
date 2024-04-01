import { Injectable } from "@angular/core";
  
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as firebase from "firebase/compat";
// import * as firebase from 'firebase';
  @Injectable({
    providedIn: 'root'
  })
  export class ApiService {
  
    constructor(private firestore: AngularFirestore) {}

    //Login
    async getAdminDataCheck(username:String,password:String) {
      let data=await this.firestore.collection('users',ref=> ref.where("email",'==',username).where("password",'==',password)).get().toPromise();
      // console.log(data)
      // data.forEach(element => {
      //   console.log(element.docs)
      // });
  return data;
} 
  }


