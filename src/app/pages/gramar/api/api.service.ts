

//   }
import { Injectable } from "@angular/core";
 
import { AngularFirestore } from '@angular/fire/compat/firestore';


import * as firebase from "firebase/compat";
import { Comprehension, Vocabulary } from "./comprehensionobj";
import { Observable, map } from "rxjs";
import { Assign } from "./assignobj ";




// import * as firebase from 'firebase';
  @Injectable({
    providedIn: 'root'
  })
  export class ApiService {
 
    constructor(private firestore: AngularFirestore) {}
 
    // Get the address-book collection data
    // getArrivalData() {
    //  // return this.firestore.collection('Users',ref=> ref.orderBy('name')).snapshotChanges();
    //    return this.firestore.collection('Users', ref => ref.where("role", "==", "student")).snapshotChanges();  
     
    // }


    // getArrivalData(SchoolId: string,vanId:string) {
    //   return this.firestore.collection(`School/${SchoolId}/Van/${vanId}/Arrival_Entry`, ref => ref.orderBy('rno')).snapshotChanges();
   
    //  }
   






//van


     getComprehensionData(SchoolId: string) {
      return this.firestore.collection(`Grammar/${SchoolId}/Comprehension`,ref => ref.orderBy('no')).snapshotChanges();
   
     }
     getComprehensionQuestionsData(garamerID: string, compid: string) {
      const path = `Grammar/${garamerID}/Comprehension/${compid}/Questions`;
      console.log('Query Path:', path);
      return this.firestore.collection(path).snapshotChanges();
    }
   
    async updateComprehensionKeyWords(id: string, keyWords: Array<string>, GrammarId: string) {
      // Step 1: Update the main document
      await this.firestore.doc(`Grammar/${GrammarId}/Comprehension/${id}`).update({
        'keywords':keyWords
       
      });


    }

   
   
     
    //  getComprehensionData(SchoolId: string) {
    //   return this.firestore.collection(`Grammar/${SchoolId}/Comprehension`)
    //     .doc('ComprehensionDocumentId')  // Assuming you have a document ID for the Comprehension document
    //     .collection('Questions')          // Reference the Questions subcollection
    //     .snapshotChanges();
    // }
   
   


    //  async createComprehensionQuestions(obj: Comprehension, GrammarId: string) {
    //   const comprehensionDocRef = await this.firestore.collection(`Grammar/${GrammarId}/Comprehension`).add({
    //     'id': '',
    //     'no': obj.no,
    //     'title': obj.title,
    //     'paragraph': obj.paragraph,
    //   });
   
    //   const compID = comprehensionDocRef.id;
    //   const questionsDocRef = await comprehensionDocRef.collection('Questions').add({
    //     'id': '',
    //     // 'qno': obj.qno,
    //     // 'a': obj.a,
    //     // 'b': obj.b,
    //     // 'c': obj.c,
    //     // 'd': obj.d,
    //     // 'qstn': obj.qstn,
    //     // 'answer': obj.answer,
    //     // 'qtype': obj.qtype,
    //   });
    //   await comprehensionDocRef.update({ 'id': compID });
    //   await questionsDocRef.update({ 'id': questionsDocRef.id });
    // }


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
   

    //vocabulary
    getVocabularyData(garamerID: string): Observable<any[]> {
      console.log('Fetching items for KG_Sheet ID:', garamerID);
      console.log("test1");
   // return this.firestore.collection(`Grammar/${garamerID}/Vocabulary`, ref => ref.orderBy('name', 'asc')).snapshotChanges();
    return this.firestore.collection(`Grammar/${garamerID}/Vocabulary`).snapshotChanges();
   // return this.firestore.collection(`Grammar/${garamerID}/Vocabulary`).snapshotChanges();
    }

     createVocabularyData(obj: Vocabulary, GrammarId: string) {
      const comprehensionDocRef =  this.firestore.collection(`Grammar/${GrammarId}/Vocabulary`).add({
        'id': '',
        'name': obj.name,
        'desc': obj.desc,
        'pic': obj.pic,
      }).then(async docRef => {
        console.log(docRef.id);
        await this.firestore.doc(`Grammar/${GrammarId}/Vocabulary/`+ docRef.id).update({
          'id':docRef.id})
      });}



      async updatevocabularyData(id: string, obj: Vocabulary, GrammarId: string) {
        // Step 1: Update the main document
        await this.firestore.doc(`Grammar/${GrammarId}/Vocabulary/${id}`).update({
          'name': obj.name,
          'desc': obj.desc,
          'pic': obj.pic,
         
        });

      }
      deletevocabularyData(dataId: string,GrammarId: string){    
        this.firestore.doc(`Grammar/${GrammarId}/Vocabulary/` + dataId).delete();
      }



    
createAssignData(obj: Assign, schoolid: string) {
  return this.firestore.collection(`School/${schoolid}/Comp_Assign`).add({
    'id':'',
    'list_id': obj.list_id,
    'standard': obj.standard,
  }).then(async docRef => {
    console.log(obj.list_id, 'list id');
    console.log(obj.standard, 'standard id');
    console.log(docRef.id, 'test');
    await this.firestore.doc(`School/${schoolid}/Comp_Assign/` + docRef.id).update({
      'id': docRef.id
    });
 
  })
}

createVocabularyData1(obj: Vocabulary, GrammarId: string) {
  const comprehensionDocRef =  this.firestore.collection(`Grammar/${GrammarId}/Vocabulary`).add({
    'name': obj.name,
    'desc': obj.desc,
    'pic': obj.pic,
  }).then(async docRef => {
    console.log(docRef.id);
    await this.firestore.doc(`Grammar/${GrammarId}/Vocabulary/${docRef.id}`).update({
      'id': docRef.id
    });
  });
}


updateAssignData(obj: Assign, schoolid: string, docId: string) {
  console.log(obj.list_id, 'list id');
  console.log(obj.standard, 'standard');
  console.log("Document id " + docId);
  return this.firestore.doc(`School/${schoolid}/Comp_Assign/${docId}`).update({
    'list_id': obj.list_id,
    'standard': obj.standard,
  });
}

    getStandardsForList(schoolid: string,kgSheetId: string, listId: string): Observable<any> {
      // Adjust the path according to your Firestore structure
      const path = `school/${kgSheetId}/Comp_Assign/${listId}`;
      return this.firestore
      .collection(`School/${schoolid}/Comp_Assign`, (ref) =>
        ref.where('list_id', '==', listId)
      )
      .valueChanges();
    
     // return this.firestore.doc<any>(path).valueChanges();
    }



       async quarydeleteComprehensionData(GrammarId: string, id: string) {
 
        const questionsCollectionRef = this.firestore.collection(`Grammar/${GrammarId}/Comprehension/${id}/Questions`);
        const questionsDocs = await questionsCollectionRef.get().toPromise();
     
        if (questionsDocs) {
          questionsDocs.forEach(async (questionDoc) => {
            await questionDoc.ref.delete();
          });
        }
     
        // Step 2: Delete the main document
        await this.firestore.doc(`Grammar/${GrammarId}/Comprehension/${id}`).delete();
      }
     
     
      getListID(schoolid: string, kgSheetId: string, selectedOption: string): Observable<string[]> {
        const path = `School/${schoolid}/Comp_Assign`;
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
      getScoreData(SchoolId: string,ScoreId:string) {
        return this.firestore.collection(`School/${SchoolId}/Score/${ScoreId}/Comprehension`).snapshotChanges();
       
       }
      



 }






 














 
 //Eyal
// getEyalDataActive() {
//   return this.firestore.collection('eyal',ref=> ref.orderBy('name').where("active",'==','1')).snapshotChanges();
// }
// getEyalData() {
//   return this.firestore.collection('eyal',ref=> ref.orderBy('number')).snapshotChanges();
// }
// createEyalData(obj: Eyal){
//  return this.firestore.collection('eyal').add(
//    {
//      'id':'',
//      'paal':obj.paal,
//      'paal_id':obj.paal_id,
//      'number':Number(obj.number),
//      'name':obj.name,
//      'nameta':obj.nameta,
//      'active':obj.active,
//      'createdAt':firebase.firestore.FieldValue.serverTimestamp(),
//      'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
//   }).then(async docRef => {
//     console.log(docRef.id);
//     await this.firestore.doc('eyal/' + docRef.id).update({
//       'id':docRef.id})
//   })
// }
// updateEyalData(key: string,obj: Eyal){
//   this.firestore.doc('eyal/' + key).update({
//     'id':key,
//     'paal':obj.paal,
//      'paal_id':obj.paal_id,
//     'number':Number(obj.number),
//     'name':obj.name,
//     'nameta':obj.nameta,
//     'active':obj.active,
//     'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
//   });
//  }
//   deleteEyalData(dataId: string){    
//     this.firestore.doc('eyal/' + dataId).delete();
//   }


//  //Athikaram
//  getAthikaramDataActive() {
//   return this.firestore.collection('athikaram',ref=> ref.orderBy('name').where("active",'==','1')).snapshotChanges();
// }
// getAthikaramData() {
//   return this.firestore.collection('athikaram',ref=> ref.orderBy('number')).snapshotChanges();
// }
// createAthikaramData(obj: Athikaram){
//  return this.firestore.collection('athikaram').add(
//    {
//      'id':'',
//      'paal':obj.paal,
//      'paal_id':obj.paal_id,
//      'eyal':obj.eyal,
//      'eyal_id':obj.eyal_id,
//      'number':Number(obj.number),
//      'name':obj.name,
//      'nameta':obj.nameta,
//      'active':obj.active,
//      'createdAt':firebase.firestore.FieldValue.serverTimestamp(),
//      'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
//   }).then(async docRef => {
//     console.log(docRef.id);
//     await this.firestore.doc('athikaram/' + docRef.id).update({
//       'id':docRef.id})
//   })
// }
// updateAthikaramData(key: string,obj: Athikaram){
//   this.firestore.doc('athikaram/' + key).update({
//     'id':key,
//     'paal':obj.paal,
//      'paal_id':obj.paal_id,
//      'eyal':obj.eyal,
//      'eyal_id':obj.eyal_id,
//     'number':Number(obj.number),
//     'name':obj.name,
//     'nameta':obj.nameta,
//     'active':obj.active,
//     'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
//   });
//  }
//   deleteAthikaramData(dataId: string){    
//     this.firestore.doc('athikaram/' + dataId).delete();
//   }
 
//  //Kural
//  getKuralDataActive() {
//   return this.firestore.collection('kural',ref=> ref.orderBy('name').where("active",'==','1')).snapshotChanges();
// }
// getKuralDataFilter(paal_id_fil: String,
//   eyal_id_fil: String,
//   athikaram_id_fil: String) {
//     if(eyal_id_fil!=null && athikaram_id_fil!=null)
//     {
//       return this.firestore.collection('kural',ref=> ref.orderBy('number').where("eyal_id",'==',eyal_id_fil).where("athikaram_id",'==',athikaram_id_fil)).snapshotChanges();


//     }else  if(athikaram_id_fil!=null)
//     {
//       return this.firestore.collection('kural',ref=> ref.orderBy('number').where("athikaram_id",'==',athikaram_id_fil)).snapshotChanges();


//     }else if(eyal_id_fil!=null)
//     {
//       console.log("yyyyyyyyy"+eyal_id_fil)
//       return this.firestore.collection('kural',ref=> ref.orderBy('number').where("eyal_id",'==',eyal_id_fil)).snapshotChanges();


//     }else{
//       return this.firestore.collection('kural',ref=> ref.orderBy('number')).snapshotChanges();


//     }
// }
// getKuralData() {
//   return this.firestore.collection('kural',ref=> ref.orderBy('number')).snapshotChanges();
// }
// createKuralData(obj: Kural){
//  return this.firestore.collection('kural').add(
//    {
//      'id':'',
//      'paal':obj.paal,
//      'paal_id':obj.paal_id,
//      'eyal':obj.eyal,
//      'eyal_id':obj.eyal_id,
//      'athikaram':obj.athikaram,
//      'athikaram_id':obj.athikaram_id,
//      'number':Number(obj.number),
//      'name':obj.name,
//      'nameta':obj.nameta,
//      'explanation':obj.explanation,
//     'explanationta':obj.explanationta,
//     'youtube_id':obj.youtube_id,
//     'audio_url':obj.audio_url,
//     'video_url':obj.video_url,
//      'active':obj.active,
//      'createdAt':firebase.firestore.FieldValue.serverTimestamp(),
//      'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
//   }).then(async docRef => {
//     console.log(docRef.id);
//     await this.firestore.doc('kural/' + docRef.id).update({
//       'id':docRef.id})
//   })
// }
// updateKuralData(key: string,obj: Kural){
//   this.firestore.doc('kural/' + key).update({
//     'id':key,
//     'paal':obj.paal,
//      'paal_id':obj.paal_id,
//      'eyal':obj.eyal,
//      'eyal_id':obj.eyal_id,
//      'athikaram':obj.athikaram,
//      'athikaram_id':obj.athikaram_id,
//     'number':Number(obj.number),
//     'name':obj.name,
//     'nameta':obj.nameta,
//     'explanation':obj.explanation,
//     'explanationta':obj.explanationta,
//     'youtube_id':obj.youtube_id,
//     'audio_url':obj.audio_url,
//     'video_url':obj.video_url,
//     'active':obj.active,
//     'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
//   });
//  }
//   deleteKuralData(dataId: string){    
//     this.firestore.doc('kural/' + dataId).delete();
//   }


//}







