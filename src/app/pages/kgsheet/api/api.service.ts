
import { Injectable } from "@angular/core";
  
import { AngularFirestore } from '@angular/fire/compat/firestore';

import * as firebase from "firebase/compat";
import { Additems } from "./additemobj";
import { Observable } from "rxjs/internal/Observable";
import { Addlist } from "./addlistobj";
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

    createAddItemData(obj: Additems,kgSheetId: string){
      return this.firestore.collection(`KG_Sheet/${kgSheetId}/Items`).add(
        {
          'id':'',
          'picture':obj.picture,
          'name':obj.name,
          'punctuation':obj.punctuation,
         
       }).then(async docRef => {
         console.log(docRef.id,'test');
         await this.firestore.doc(`KG_Sheet/${kgSheetId}/Items/` + docRef.id).update({
           'id':docRef.id})
           console.log(docRef.id,'test');
           console.log(obj,'test');
       })
     }

     updateAddItemData(id: string,obj: Additems,kgSheetId: string){
      this.firestore.doc(`KG_Sheet/${kgSheetId}/Items/` + id).update({
        'id':id,
        'picture':obj.picture,
        'name':obj.name,
        'punctuation':obj.punctuation, 
  
      });
     }
     deleteAddItemData(dataId: string,kgSheetId: string){    
      this.firestore.doc(`KG_Sheet/${kgSheetId}/Items/` + dataId).delete();
    }
    insertImageDetails(imageDetails: any) {
      //this.imageDetailList.push(imageDetails);
    }

  // Add list

    getAddListData(kgSheetId: string): Observable<any[]> {
     return this.firestore.collection(`KG_Sheet/${kgSheetId}/List`).snapshotChanges();
   
    }

    createAddListData(obj: Addlist,kgSheetId: string){
      return this.firestore.collection(`KG_Sheet/${kgSheetId}/List`).add(
        {
          'id':'',
          'picture':obj.picture,
          'name':obj.name,
          'items':obj.items,
          // 'punctuation':obj.punctuation,
         
       }).then(async docRef => {
         console.log(docRef.id,'test');
         await this.firestore.doc(`KG_Sheet/${kgSheetId}/List/` + docRef.id).update({
           'id':docRef.id})
           console.log(docRef.id,'test');
           console.log(obj,'test');
       })
     }

  }

  
