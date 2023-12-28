
//   }
import { Injectable } from "@angular/core";
  
import { AngularFirestore } from '@angular/fire/compat/firestore';

import * as firebase from "firebase/compat";
import { CreateTest } from "./testobj";
import { Marks } from "./addvanobj";
import { CreateMarks } from "./studentmarkobj";




// import * as firebase from 'firebase';
  @Injectable({
    providedIn: 'root'
  })
  export class ApiService {
  
    constructor(private firestore: AngularFirestore) {}
  
 

    getArrivalData(SchoolId: string,vanId:string) {
      return this.firestore.collection(`School/${SchoolId}/Van/${vanId}/Arrival_Entry`, ref => ref.orderBy('rno')).snapshotChanges();
    
     }
     
    
//create test
gettestData(SchoolId: string) {
  return this.firestore.collection(`School/${SchoolId}/Test_Name`).snapshotChanges();

 }

 createtestData(obj:CreateTest,SchoolId: string){
  return this.firestore.collection(`School/${SchoolId}/Test_Name`).add(
    {
      'testid':'',
      'name':obj.name,
      'standard':obj.standard,
      'startdate':obj.startdate,
      'year':obj.year,
      'enddate':obj.enddate, 
      // 'createdAt':firebase.firestore.FieldValue.serverTimestamp(),
      // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
   }).then(async docRef => {
     console.log(docRef.id);
     await this.firestore.doc(`School/${SchoolId}/Test_Name/`+ docRef.id).update({
       'testid':docRef.id})
   })
 }

 updatetestData(testid: string,obj: CreateTest,SchoolId:string){
  this.firestore.doc(`School/${SchoolId}/Test_Name/` + testid).update({
    
    'testid':testid,
    'name':obj.name,
    'standard':obj.standard,
    'startdate':obj.startdate,
    'year':obj.year,
    'enddate':obj.enddate, 
    // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
  });
 }
 deletetestData(Routeid:string, SchoolId:string ){    
  this.firestore.doc(`School/${SchoolId}/Test_Name/` + Routeid).delete();
}


//van

     getVanData(SchoolId: string,vanId:string) {
      return this.firestore.collection(`School/${SchoolId}/Van/${vanId}/Vans`).snapshotChanges();
    
     }
      createVanData(obj:Marks,SchoolId: string,vanId:string ){
      return this.firestore.collection(`School/${SchoolId}/Van/${vanId}/Vans`).add(
        {
          'vanid':'',
          'chassis':obj.chassis,
          'disel':obj.disel,
          'engno':obj.engno,
          'pic':obj.pic,
          'regno':obj.regno, 
          'seats':obj.seats,
          'year':obj.year,
          // 'createdAt':firebase.firestore.FieldValue.serverTimestamp(),
          // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
       }).then(async docRef => {
         console.log(docRef.id);
         await this.firestore.doc(`School/${SchoolId}/Van/${vanId}/Vans/`+ docRef.id).update({
           'vanid':docRef.id})
       })
     }

     updateVanData(vanid: string,obj: Marks,SchoolId:string,vanId:string ){
      this.firestore.doc(`School/${SchoolId}/Van/${vanId}/Vans/` + vanid).update({
        
        'vanid':vanid,
          'chassis':obj.chassis,
          'disel':obj.disel,
          'engno':obj.engno,
          'pic':obj.pic,
          'regno':obj.regno, 
          'seats':obj.seats,
          'year':obj.year,
        // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
      });
     }
     deleteVanData(Routeid:string, SchoolId:string,vanId:string ){    
      this.firestore.doc(`School/${SchoolId}/Van/${vanId}/Vans/` + Routeid).delete();
    }







//map
getDriverData(SchoolId: string) {
  return this.firestore.collection(`School/${SchoolId}/Drivers`, ref => ref.orderBy('name')).snapshotChanges();
 
 }

  updateRoutemapData(Routeid: string,SchoolId:string,vanId:string,driverid:string,vanid:string ){
      this.firestore.doc(`School/${SchoolId}/Van/${vanId}/Routes/` + Routeid).update({
        
        'routeid':Routeid,
        'driverid':driverid,
        'vanid':vanid,
        
        // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
      });
     }
   
//student mark
getAddressBookData() {
  return this.firestore.collection('Users', ref => ref.where("role", "==", "student")).snapshotChanges();
}

// mark assign

createMarkstData(marks: CreateMarks,SchoolId: string,studentId: string,test_id:string| null,year:string |null){
  return this.firestore.collection(`School/${SchoolId}/Test_Marks`).add(
    {
      'id':'',
      'stud_id':studentId,
      'test_id': test_id,
      'marks':marks.marks,
      'year':year,
     
   }).then(async docRef => {
     console.log(docRef.id);
     await this.firestore.doc(`School/${SchoolId}/Test_Marks/`+ docRef.id).update({
       'id':docRef.id})
   })
 }


 }



  





