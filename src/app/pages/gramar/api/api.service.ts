

//   }
import { Injectable } from "@angular/core";
 
import { AngularFirestore } from '@angular/fire/compat/firestore';


import * as firebase from "firebase/compat";
import { Comprehension } from "./comprehensionobj";




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
        // Add other fields as needed
        // 'updatedAt': firebase.firestore.FieldValue.serverTimestamp(),
      });
   
      // Step 2: Update or add questions in the subcollection 'Questions'
      const questionsCollectionRef = this.firestore.collection(`Grammar/${GrammarId}/Comprehension/${id}/Questions`);
   
      for (const question of obj.questions) {
        const questionId = question.id || this.firestore.createId(); // Use existing ID or create a new one
        const questionDocRef = questionsCollectionRef.doc(questionId);
        await questionDocRef.set({
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
     
     


    //  deleteComprehensionData( GrammarId: string ,id:string ){  
    //   console.log(GrammarId ,id )  
    //     this.firestore.doc(`Grammar/${GrammarId}/Comprehension/`+ id).delete();
    //   }


      // async updateComprehensionData(id: string, obj: Comprehension, GrammarId: string) {
      //   const comprehensionDocRef = this.firestore.doc(`Grammar/${GrammarId}/Comprehension/` + id).ref;
     
      //   try {
      //     // Update main Comprehension document
      //     await comprehensionDocRef.update({
      //       'no': obj.no,
      //       'title': obj.title,
      //       'paragraph': obj.paragraph,
      //     });
     
      //     // Check if Questions subcollection exists
      //     const questionsCollectionRef = comprehensionDocRef.collection('Questions');
     
      //     // Update or add a document in the Questions subcollection
      //     const questionsQuerySnapshot = await questionsCollectionRef.get();
     
      //     if (!questionsQuerySnapshot.empty) {
      //       // Assuming there's only one document in the Questions subcollection
      //       const questionDocRef = questionsQuerySnapshot.docs[0].ref;
      //       await questionDocRef.update({
      //         'qno': obj.qno,
      //         'a': obj.a,
      //         'b': obj.b,
      //         'c': obj.c,
      //         'd': obj.d,
      //         'qstn': obj.qstn,
      //         'answer': obj.title, // Note: I assume 'answer' should be updated to 'obj.title'
      //         'qtype': obj.qtype,
      //       });
      //     } else {
      //       // If there are no documents, add a new one
      //       const newQuestionDocRef = await questionsCollectionRef.add({
      //         'qno': obj.qno,
      //         'a': obj.a,
      //         'b': obj.b,
      //         'c': obj.c,
      //         'd': obj.d,
      //         'qstn': obj.qstn,
      //         'answer': obj.title,
      //         'qtype': obj.qtype,
      //       });
     
      //       await newQuestionDocRef.update({ 'id': newQuestionDocRef.id });
      //     }
     
      //   } catch (error) {
      //     console.error('Error updating data:', error);
      //   }
      // }
     


    //  updateVanData(vanid: string,obj: Van,SchoolId:string,vanId:string ){
    //   this.firestore.doc(`School/${SchoolId}/Van/${vanId}/Vans/` + vanid).update({
       
    //     'vanid':vanid,
    //       'chassis':obj.chassis,
    //       'disel':obj.disel,
    //       'engno':obj.engno,
    //       'pic':obj.pic,
    //       'regno':obj.regno,
    //       'seats':obj.seats,
    //       'year':obj.year,
    //     // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
    //   });
    //  }
    //  deleteVanData(Routeid:string, SchoolId:string,vanId:string ){    
    //   this.firestore.doc(`School/${SchoolId}/Van/${vanId}/Vans/` + Routeid).delete();
    // }
















// getRouteData(SchoolId: string) {
//   return this.firestore.collection(`School/${SchoolId}/Routes`, ref => ref.orderBy('name')).snapshotChanges();
 
//  }


//  createRouteData(obj:Route,SchoolId: string ){
//       return this.firestore.collection(`School/${SchoolId}/Routes`).add(
//         {
//           'Routeid':'',
//           'aadhar':obj.aadhar,
//           'name':obj.name,
//           'doj':obj.doj,
//           'pic':obj.pic,
//           'phn':obj.phn,
//           'dob':obj.dob,
//           'address':obj.address,
//           'pincode':obj.pincode,
//           'age':obj.age,
//           'town':obj.town,
//           'license':obj.license,
//           'pancard':obj.pancard,
         
//           // 'createdAt':firebase.firestore.FieldValue.serverTimestamp(),
//           // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
//        }).then(async docRef => {
//          console.log(docRef.id);
//          await this.firestore.doc(`School/${SchoolId}/Routes/`+ docRef.id).update({
//            'Routeid':docRef.id})
//        })
//      }


//      updateRouteData(Routeid: string,obj: Route,SchoolId:string){
//       this.firestore.doc(`School/${SchoolId}/Routes/` + Routeid).update({
//         'Routeid':Routeid,
//           'aadhar':obj.aadhar,
//           'name':obj.name,
//           'doj':obj.doj,
//           'pic':obj.pic,
//           'phn':obj.phn,
//           'dob':obj.dob,
//           'address':obj.address,
//           'pincode':obj.pincode,
//           'age':obj.age,
//           'town':obj.town,
//           'license':obj.license,
//           'pancard':obj.pancard,
//         // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
//       });
//      }
//      deleteRouteData(Routeid:string, SchoolId:string){    
//       this.firestore.doc(`School/${SchoolId}/Routes/`  + Routeid).delete();
//     }
    // insertImageDetails(imageDetails: any) {
    //   //this.imageDetailList.push(imageDetails);
    // }




    //teacher


  //   getTeacherData() {
  //     // return this.firestore.collection('Users',ref=> ref.orderBy('name')).snapshotChanges();
  //       return this.firestore.collection('Users', ref => ref.where("role", "==","teacher")).snapshotChanges();  
       
  //    }
 
  //    createTeacherData(obj: Teacher){
  //      return this.firestore.collection('Users').add(
  //        {
  //          'id':'',
  //          'age':obj.age,
  //          'name':obj.name,
  //          'role':obj.role,
  //          'doj':obj.doj,
  //          'phn':obj.phn,
  //          'dob':obj.dob,
  //          'address':obj.address,
  //          'img':obj.img,
  //          'email':obj.email,
  //          'status':obj.status,
  //          'qualification':obj.qualification,
  //          'gender':obj.gender,
  //          'school':localStorage.getItem('school_id')
  //          // 'createdAt':firebase.firestore.FieldValue.serverTimestamp(),
  //          // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
  //       }).then(async docRef => {
  //         console.log(docRef.id);
  //         await this.firestore.doc('Users/' + docRef.id).update({
  //           'id':docRef.id})
  //       })
  //     }
 
  //     updateTeacherData(id: string,obj: Teacher){
  //      this.firestore.doc('Users/' + id).update({
  //        'id':id,
         
  //        'age':obj.age,
  //        'name':obj.name,
  //        'role':obj.role,
  //        'doj':obj.doj,
  //        'phn':obj.phn,
  //        'dob':obj.dob,
  //        'address':obj.address,
  //        'img':obj.img,
  //        'email':obj.email,
  //        'status':obj.status,
  //        'qualification':obj.qualification,
  //        'gender':obj.gender,
  //        // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
  //      });
  //     }
  //     deleteTeacherData(dataId: string){    
  //      this.firestore.doc('Users/' + dataId).delete();
  //    }
  //   //  insertImageDetails(imageDetails: any) {
  //   //    //this.imageDetailList.push(imageDetails);
  //   //  }


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







