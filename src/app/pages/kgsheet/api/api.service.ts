
import { Injectable } from "@angular/core";
  
import { AngularFirestore } from '@angular/fire/compat/firestore';

import * as firebase from "firebase/compat";
import { Additems } from "./additemobj";
import { Observable } from "rxjs/internal/Observable";
// import * as firebase from 'firebase';
  @Injectable({
    providedIn: 'root'
  })
  export class ApiService {
  
    constructor(private firestore: AngularFirestore) {}
  
    // Get the address-book collection data
    // getAddItemData() {
    //   return this.firestore.collection('KG_Sheet/Items').snapshotChanges();
    // }

    getAddItemData(kgSheetId: string): Observable<any[]> {
      // Use 'collection' to access the 'KG_Sheet' collection and then 'doc' to specify the document ID
      // Finally, use 'collection' again to access the 'Items' subcollection within the specified document
      console.log('Fetching items for KG_Sheet ID:', kgSheetId);
      console.log("test1");
        
      console.log( this.firestore.collection('KG_Sheet').doc(kgSheetId).collection('Items').valueChanges());
      console.log("test2");
     // return this.firestore.collection('KG_Sheet').doc(kgSheetId).collection('Items').valueChanges();
     return this.firestore.collection(`KG_Sheet/${kgSheetId}/Items`).snapshotChanges();
   
    }

    createAddItemData(obj: Additems){
      return this.firestore.collection('Users').add(
        {
          // 'id':'',
          //  'number':obj.number,
          // 'name':obj.name,
          // 'image':obj.image,
          // 'mobile':obj.mobile, 
          // 'Dob':obj.Dob,
          // 'address':obj.address,
          // 'parentname':obj.parentname,
          // 'standard':obj.standard,
          // 'section':obj.section,
          // 'school':obj.school
          // 'createdAt':firebase.firestore.FieldValue.serverTimestamp(),
          // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
       }).then(async docRef => {
         console.log(docRef.id);
         await this.firestore.doc('Users/' + docRef.id).update({
           'id':docRef.id})
       })
     }

     updateAddItemData(id: string,obj: Additems){
      this.firestore.doc('Users/' + id).update({
        'id':id,
        // 'number':obj.number,
        // 'name':obj.name,
        // 'mobile':obj.mobile, 
        // 'Dob':obj.Dob,
        // 'address':obj.address,
        // 'parentname':obj.parentname,
        // 'standard':obj.standard,
        // 'section':obj.section,
        // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
      });
     }
     deleteAddItemData(dataId: string){    
      this.firestore.doc('Users/' + dataId).delete();
    }
    insertImageDetails(imageDetails: any) {
      //this.imageDetailList.push(imageDetails);
    }
  }

  
