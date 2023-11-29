

import { Injectable } from "@angular/core";
 
import { AngularFirestore } from '@angular/fire/compat/firestore';


import * as firebase from "firebase/compat";
import { Additems } from "./additemobj";
import { Observable } from "rxjs/internal/Observable";
import { Addlist } from "./addlistobj";
import { Assign } from "./assignobj ";
import { map } from "rxjs";
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
       
    //  console.log( this.firestore.collection('KG_Sheet').doc(kgSheetId).collection('Items').valueChanges());
      console.log("test2");
     // return this.firestore.collection('KG_Sheet').doc(kgSheetId).collection('Items').valueChanges();
    // return this.firestore.collection(`KG_Sheet/${kgSheetId}/Items`).snapshotChanges();
    return this.firestore.collection(`KG_Sheet/${kgSheetId}/Items`, ref => ref.orderBy('name', 'asc').limit(30)).snapshotChanges();
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
     return this.firestore.collection(`KG_Sheet/${kgSheetId}/List`, ref => ref.orderBy('name', 'asc')).snapshotChanges();
   
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


     updateListData(id: string,obj: Addlist,kgSheetId: string){
      this.firestore.doc(`KG_Sheet/${kgSheetId}/List/` + id).update({
        'id':id,      
        'name':obj.name,
        'picture':obj.picture,
        // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
      });
     }
     updateListItemsData(id: string,obj: Addlist,kgSheetId: string){
      this.firestore.doc(`KG_Sheet/${kgSheetId}/List/` + id).update({
        'items':obj.items
        // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
      });
     }
     deleteListData(dataId: string,kgSheetId: string){    
      this.firestore.doc(`KG_Sheet/${kgSheetId}/List/` + dataId).delete();
    }


// Assign
// createAssignData(obj: Assign,schoolid: string){
//   return this.firestore.collection(`School/${schoolid}/KGSheet_Assign`).add(
//     {
//       'list_id':obj.list_id,
//       'standard':obj.standard,
   
//       // 'punctuation':obj.punctuation,
     
//    }).then(async docRef => {
//     console.log(obj.list_id,'list id');
//     console.log(obj.standard,'standard id');
//      console.log(docRef.id,'test');
//      await this.firestore.doc(`School/${schoolid}/KGSheet_Assign/` + docRef.id).update({
//        'id':docRef.id})
//        console.log(docRef.id,'test');
//        console.log(obj,'test');
//    })
//  }


checkListIdExists(schoolid: string, listId: string): Observable<any[]> {
  return this.firestore
    .collection(`School/${schoolid}/KGSheet_Assign`, (ref) =>
      ref.where('list_id', '==', listId)
    )
    .valueChanges();
}


createAssignData(obj: Assign, schoolid: string) {
  return this.firestore.collection(`School/${schoolid}/KGSheet_Assign`).add({
    'list_id': obj.list_id,
    'standard': obj.standard,
  }).then(async docRef => {
    console.log(obj.list_id, 'list id');
    console.log(obj.standard, 'standard id');
    console.log(docRef.id, 'test');
    await this.firestore.doc(`School/${schoolid}/KGSheet_Assign/` + docRef.id).update({
      'id': docRef.id
    });
 
  })
}


updateAssignData(obj: Assign, schoolid: string, docId: string) {
  console.log(obj.list_id, 'list id');
  console.log(obj.standard, 'standard');
  console.log("Document id " + docId);
  return this.firestore.doc(`School/${schoolid}/KGSheet_Assign/${docId}`).update({
    'list_id': obj.list_id,
    'standard': obj.standard,
  });
}


getStandardsForList(schoolid: string,kgSheetId: string, listId: string): Observable<any> {
  // Adjust the path according to your Firestore structure
  const path = `school/${kgSheetId}/KGSheet_Assign/${listId}`;
  return this.firestore
  .collection(`School/${schoolid}/KGSheet_Assign`, (ref) =>
    ref.where('list_id', '==', listId)
  )
  .valueChanges();
 // return this.firestore.doc<any>(path).valueChanges();
}










  }


 





