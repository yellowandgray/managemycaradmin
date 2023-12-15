import { Injectable } from "@angular/core";
 
import { AngularFirestore } from '@angular/fire/compat/firestore';








import * as firebase from "firebase/compat";
import { Additems } from "./additemobj";
import { Observable } from "rxjs/internal/Observable";
import { Addlist } from "./addlistobj";
import { Assign } from "./assignobj ";
import { map } from "rxjs";
import { ListQuestion } from "./listquestionsobj";
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
    return this.firestore.collection(`KG_Sheet/${kgSheetId}/Items`, ref => ref.orderBy('name', 'asc')).snapshotChanges();
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
    getAddListDataDetails(kgSheetId: string, listid: string): Observable<Addlist | undefined> {
      return this.firestore.collection<Addlist>(`KG_Sheet/${kgSheetId}/List`).doc(listid).valueChanges();
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




getListID(schoolid: string, kgSheetId: string, selectedOption: string): Observable<string[]> {
  const path = `School/${schoolid}/KGSheet_Assign`;
  return this.firestore
    .collection(path, (ref) => ref.where('standard', 'array-contains', selectedOption))
    .valueChanges()
    .pipe(
      map((documents: any[]) => {
        // Extract list_id values from the obtained documents
        return documents.map(doc => doc.list_id);
      }),
   
    );
}








async createListQuestions(obj: Addlist, KgsheetId: string, Listid: string) {
  const ListDocRef = this.firestore.collection(`KG_Sheet/${KgsheetId}/List`).doc(Listid);
console.log("Questions",obj.questions)
  try {
    // Add questions to the sub-collection
    for (const question of obj.questions) {
      console.log("Questions For Loop",question)
      const questionDocRef = await ListDocRef.collection('Questions').add({
       
        'qno': question.qno,
        'a': question.a,
        'a_name':question.a_name,
        'b': question.b,
        'b_name':question.b_name,
        'c': question.c,
        'c_name':question.c_name,
        'd': question.d,
        'd_name':question.d_name,
        'qstn': question.qstn,
        'crtans': question.crtans,
      });




      // Optionally update the question document ID
      await questionDocRef.update({ 'id': questionDocRef.id });
    }




    console.log('Questions added successfully.');
  } catch (error) {
    console.error('Error adding questions:', error);
  }
}




async updateListQuestions(kgSheetId: string, obj: Addlist, listId: string) {
  const ListDocRef = this.firestore.collection(`KG_Sheet/${kgSheetId}/List/${listId}/Questions`);


  for (const question of obj.questions) {
    const questionId = question.id;


    if (questionId) {
      // Update existing document
      const questionDocRef = ListDocRef.doc(questionId);
      await questionDocRef.set({
        'id':question.id,
        'qno': question.qno,
        'a': question.a,
        'a_name': question.a_name,
        'b': question.b,
        'b_name': question.b_name,
        'c': question.c,
        'c_name': question.c_name,
        'd': question.d,
        'd_name': question.d_name,
        'qstn': question.qstn,
        'crtans': question.crtans,
      });
    } else {
      // Create new document
      const newQuestionDocRef = await ListDocRef.add({
        'qno': question.qno,
        'a': question.a,
        'a_name': question.a_name,
        'b': question.b,
        'b_name': question.b_name,
        'c': question.c,
        'c_name': question.c_name,
        'd': question.d,
        'd_name': question.d_name,
        'qstn': question.qstn,
        'crtans': question.crtans,
      });


      // Get the generated ID from the newly created document
      const generatedId = newQuestionDocRef.id;


      // Update the document with the generated ID
      await newQuestionDocRef.update({ 'id': generatedId });
    }
  }
}




async removeQuestionFromDatabase(id: string, listId: string, questionId: string) {
//  this.firestore.doc(`KG_Sheet/${id}/List/${listId}/Questions/${questionId}`).delete();


  const questionDocRef = this.firestore.doc(`KG_Sheet/${id}/List/${listId}/Questions/${questionId}`);
  try {
    await questionDocRef.delete();
    console.log(`Question with ID ${questionId} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting question:', error);
  }
}




fetchQuestionsByListId(listId: string, kgSheetId: string): Observable<ListQuestion[]> {
  const path = `KG_Sheet/${kgSheetId}/List/${listId}/Questions`;
  console.log('Query Path:', path);
  return this.firestore.collection(path).snapshotChanges()
    .pipe(
      map(actions => actions.map(action => action.payload.doc.data() as ListQuestion))
    );
}




getComprehensionQuestionsData(garamerID: string, compid: string) {
  const path = `Grammar/${garamerID}/Comprehension/${compid}/Questions`;
  console.log('Query Path:', path);
  return this.firestore.collection(path).snapshotChanges();
}




  }




