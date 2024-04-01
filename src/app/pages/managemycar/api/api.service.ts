// import { Injectable, Type } from '@angular/core';
// //import { AngularFirestore } from '@angular/fire/firestore';
// import { AngularFirestore } from '@angular/fire/compat/firestore';






// import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
// import * as firebase from 'firebase';
// import 'firebase/auth'; // Import other Firebase services as needed


// import 'firebase/firestore';
// import { Address } from './addressobj';




// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {


//    //fireSQL = new FireSQL(firebase.firestore());


//   constructor(private firestore: AngularFirestore,private db: AngularFireDatabase) {
//     firebase.firestore().settings({
//       ignoreUndefinedProperties: true,
//     })
   


//   }


// /////////////////////////
// // sendToken(token:string) {
// //   // this.firestore.doc('adminlogin/' + "6fJvKBu5brMiC3q3scCX").update({
// //   //   'token':token,    
// //   // });
// // }


// /////////////////////////
// // getAdminDataCheck() {
// //   return this.firestore.collection('adminlogin').get().toPromise();
// // }




//  //Paal
// getPaalDataActive() {
//   return this.firestore.collection('address-book',(ref: { orderBy: (arg0: string) => { (): any; new(): any; where: { (): any; new(): any; }; }; })=> ref.orderBy('name').where()).snapshotChanges();
// }
// getPaalData() {
//   return this.firestore.collection('address-book',(ref: { orderBy: (arg0: string) => any; })=> ref.orderBy('name')).snapshotChanges();
// }
// createPaalData(obj: Address){
//  return this.firestore.collection('address-book').add(
//    {
//      'id':'',
//     //  'number':Number(obj.number),
//      'name':obj.name,
//      'age':obj.age,
//      'createdAt':firebase.firestore.FieldValue.serverTimestamp(),
//      'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
//   }).then(async docRef => {
//     console.log(docRef.id);
//     await this.firestore.doc('address-book/' + docRef.id).update({
//       'id':docRef.id})
//   })
// }
// updatePaalData(key: string,obj: Address){
//   this.firestore.doc('address-book/' + key).update({
//     'id':key,
//     // 'number':Number(obj.number),
//     'name':obj.name,
//     'age':obj.age,
//     // 'active':obj.active,
//     'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
//   });
//  }
//   deletePaalData(dataId: string){    
//     this.firestore.doc('address-book/' + dataId).delete();
//   }
import { Injectable } from "@angular/core";
 
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as firebase from "firebase/compat";
import { Queries } from "./queriesobj";

import { Observable, map } from "rxjs";
import {Booking}from "./bookingobj";
import { Garages } from "./garageobj";
import { User, Vehicle } from "./userobj";
import { Comprehension } from "../../gramar/api/comprehensionobj";
// import * as firebase from 'firebase';
  @Injectable({
    providedIn: 'root'
  })
  export class ApiService {
 
    constructor(private firestore: AngularFirestore) {}
 
    //Get the address-book collection data
    // getAddressBookData() {
    //  // return this.firestore.collection('Users',ref=> ref.orderBy('name')).snapshotChanges();
    //    return this.firestore.collection('Users', ref => ref.where("role", "==", "student") && ref => ref.orderBy('name')).snapshotChanges();  
     
    // }
    getAddressBookData() {
      return this.firestore.collection('booking',).snapshotChanges();
    }

    getAddressData(bookId: string): Observable<any[]> {
      return this.firestore.collection(`booking/${bookId}/service`).valueChanges();
    }
 


    createStudentData(obj: Booking){
      return this.firestore.collection('booking').add(
        {
          'id':'',
          'bookingdate':obj.bookingdate,
          'motdue':obj.motdue,
          'motnotes':obj.motnotes,
          'status':obj.status,
          'time':obj.time,
          
          // 'createdAt':firebase.firestore.FieldValue.serverTimestamp(),
          // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
       }).then(async docRef => {
         console.log(docRef.id);
         await this.firestore.doc('booking/' + docRef.id).update({
           'id':docRef.id})
       })
     }


     updateStudentData(id: string,obj: Booking){
      this.firestore.doc('booking/' + id).update({
        'id':id,
        'bookingdate':obj.bookingdate,
        'motdue':obj.motdue,
        'motnotes':obj.motnotes,
        'status':obj.status,
        'time':obj.time,
        // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
      });
     }
     deleteStudentData(dataId: string){    
      this.firestore.doc('booking/' + dataId).delete();
    }
    insertImageDetails(imageDetails: any) {
      //this.imageDetailList.push(imageDetails);
    }





    getArrivalData(SchoolId: string,vanId:string) {
      return this.firestore.collection(`School/${SchoolId}/Van/${vanId}/Arrival_Entry`, ref =>  ref.orderBy('rno')).snapshotChanges();
    
     }
    //queries

    getQueriesData() {
      return this.firestore.collection('queries',).snapshotChanges();
    }





     
  




    //garages
    getGaragesData() {
      return this.firestore.collection('garages',).snapshotChanges();
    }
    getPriceInfo(garageId: string): Observable<any[]> {
      return this.firestore.collection(`garages/${garageId}/priceinfo`).valueChanges();
    }

    getComprehensionData(SchoolId: string) {
      return this.firestore.collection(`Grammar/${SchoolId}/Comprehension`,ref => ref.orderBy('no')).snapshotChanges();
   
     }
     getComprehensionQuestionsData(garamerID: string, compid: string) {
      const path = `Grammar/${garamerID}/Comprehension/${compid}/Questions`;
      console.log('Query Path:', path);
      return this.firestore.collection(path).snapshotChanges();
    }
   
    async updateComprehensionKeyWords(id: string, keyWords: Array<string>, GrammarId: string) {
 
      await this.firestore.doc(`Grammar/${GrammarId}/Comprehension/${id}`).update({
        'keywords':keyWords
       
      });


    }
    createGaragesData(obj: Garages){
      return this.firestore.collection('garages').add(
        {
          'id':'',
          'about':obj.about,
          'address':obj.address,
          'garageid':obj.garageid,
          'geolocation':obj.geolocation,
          'name':obj.name,
          'openinghrs':obj.openinghrs,
          'otherservices':obj.otherservices,
          'postcode':obj.postcode,
        
       }).then(async docRef => {
         console.log(docRef.id);
         await this.firestore.doc('garages/' + docRef.id).update({
           'id':docRef.id})
       })
     }


     updateGaragesData(id: string,obj: Garages){
      this.firestore.doc('garages/' + id).update({
        'id':id,
        'about':obj.about,
        'address':obj.address,
        'garageid':obj.garageid,
        'geolocation':obj.geolocation,
        'name':obj.name,
        'openinghrs':obj.openinghrs,
        'otherservices':obj.otherservices,
        'postcode':obj.postcode,
      
      });
     }
     deleteGaragestData(dataId: string){    
      this.firestore.doc('garages/' + dataId).delete();
    }


    async createComprehensionQuestions(obj: Comprehension, GrammarId: string) {
      const comprehensionDocRef = await this.firestore.collection(`Grammar/${GrammarId}/Comprehension`).add({
        'id': '',
        'no': obj.no,
        'title': obj.title,
        'paragraph': obj.paragraph,
        'pic': obj.pic,
        'keywords':obj.keywords
      });
 
      const compID = comprehensionDocRef.id;
      console.log(obj);
 
     
      for (const question of obj.questions) {
        const questionDocRef = await comprehensionDocRef.collection('Questions').add({
          'id': '',
          'qno': question.qno,
          'a': question.a,
          'b': question.b,
          'c': question.c,
          'd': question.d,
          'qstn': question.qstn,
          'answer': question.answer,
          'qtype': question.qtype,
        });
 
       
        await questionDocRef.update({ 'id': questionDocRef.id });
      }
 
     
      await comprehensionDocRef.update({ 'id': compID });
    }
   


     
    async updateComprehensionData(id: string, obj: Comprehension, GrammarId: string) {
      // Step 1: Update the main document
      await this.firestore.doc(`Grammar/${GrammarId}/Comprehension/${id}`).update({
        'no': obj.no,
        'title': obj.title,
        'paragraph': obj.paragraph,
        'pic': obj.pic,
        'keywords':obj.keywords
       
      });
   

      const questionsCollectionRef = this.firestore.collection(`Grammar/${GrammarId}/Comprehension/${id}/Questions`);
   
      for (const question of obj.questions) {
        const questionId = question.id || this.firestore.createId(); // Use existing ID or create a new one
        const questionDocRef = questionsCollectionRef.doc(questionId);
        await questionDocRef.set({
          'id':question.id,
          'qno': question.qno,
          'a': question.a,
          'b': question.b,
          'c': question.c,
          'd': question.d,
          'qstn': question.qstn,
          'answer': question.answer,
          'qtype': question.qtype,
        });
      }
    }

//User

getUserData() {
  return this.firestore.collection('users', ref => ref.where("role", "==","user")).snapshotChanges();
}


getVehicleData(bookId: string): Observable<Vehicle[]> {
  return this.firestore.collection(`users/${bookId}/vehicle`).valueChanges()
    .pipe(
      map((vehicles: any[]) => {
        return vehicles.map(vehicle => {
          return {
            book: vehicle.book || '',
            color: vehicle.color || '',
            dateregd: vehicle.dateregd || '',
            desc: vehicle.desc || '',
            engine: vehicle.engine || '',
            eurostatus: vehicle.eurostatus || '',
            fueltype: vehicle.fueltype || '',
            make: vehicle.make || '',
            model: vehicle.model || '',
            motduedate: vehicle.motduedate || '',
            regnplace: vehicle.regnplace || '',
            vehicleage: vehicle.vehicleage || '',
            vehicleno: vehicle.vehicleno || '',
            yearmanuf: vehicle.yearmanuf || ''
          } as Vehicle;
        });
      })
    );
}


createUserData(obj: User){
  return this.firestore.collection('users').add(
    {
      'id':'',
      'firstname':obj.firstname,
     
      'lastname':obj.lastname,
      'email':obj.email,
      'address':obj.address,
      'phone':obj.phone,
      'postcode':obj.postcode,
      'role':obj.role,
      // 'createdAt':firebase.firestore.FieldValue.serverTimestamp(),
      // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
   }).then(async docRef => {
     console.log(docRef.id);
     await this.firestore.doc('users/' + docRef.id).update({
       'id':docRef.id})
   })
 }


 updateUserData(id: string,obj: User){
  this.firestore.doc('users/' + id).update({
    'id':id,
    'firstname':obj.firstname,
      'lastname':obj.lastname,
      'email':obj.email,
      'address':obj.address,
      'phone':obj.phone,
      'postcode':obj.postcode,
      'role':obj.role,
  
  });
 }
 deleteUserData(dataId: string){    
  this.firestore.doc('users/' + dataId).delete();
}

  }
