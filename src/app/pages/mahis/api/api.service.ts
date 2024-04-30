
import { Injectable } from "@angular/core";
 
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Student } from "./addressobj";
import * as firebase from "firebase/compat";
import { Driver } from "./driverobj";
import { Teacher } from "./trainingobj";
import { Observable } from "rxjs";
import { Employer } from "./employerobj";
// import * as firebase from 'firebase';
  @Injectable({
    providedIn: 'root'
  })
  export class ApiService {
 
    constructor(private firestore: AngularFirestore) {}
 
    
    getEmployerData() {
      return this.firestore.collection('employer',).snapshotChanges();
    }




  

    createEmployerData(obj: Employer){
      return this.firestore.collection('employer').add(
        {
          'id': '',
          'businessname': obj.businessname,
          'city': obj.city,
          'country': obj.country,
          'email': obj.email,
          'firstname': obj.firstname,
          'lastname': obj.lastname,
          'officephoneno': obj.officephoneno,
          'password': obj.password,
          'phonenumber': obj.phonenumber,
          'logo': obj.logo,
        
         
       }).then(async docRef => {
         console.log(docRef.id);
         await this.firestore.doc('employer/' + docRef.id).update({
           'id':docRef.id})
       })
     }


     updateEmployerData(id: string,obj: Employer){
      this.firestore.doc('employer/' + id).update({
        'id':id,
        'businessname': obj.businessname,
        'city': obj.city,
        'country': obj.country,
        'email': obj.email,
        'firstname': obj.firstname,
        'lastname': obj.lastname,
        'officephoneno': obj.officephoneno,
        'password': obj.password,
        'phonenumber': obj.phonenumber,
        'logo': obj.logo,
       
      });
     }
     deleteEmployerData(dataId: string){    
      this.firestore.doc('employer/' + dataId).delete();
    }


    insertImageDetails(imageDetails: any) {
      //this.imageDetailList.push(imageDetails);
    }





    getArrivalData(SchoolId: string,vanId:string) {
      return this.firestore.collection(`School/${SchoolId}/Van/${vanId}/Arrival_Entry`, ref =>  ref.orderBy('rno')).snapshotChanges();
    
     }
    //driver


getDriverData(SchoolId: string) {
  return this.firestore.collection(`School/${SchoolId}/Drivers`, ref => ref.orderBy('name')).snapshotChanges();
 
 }


 createDriverData(obj:Driver,SchoolId: string ){
      return this.firestore.collection(`School/${SchoolId}/Drivers`).add(
        {
          'driverid':'',
          'aadhar':obj.aadhar,
          'name':obj.name,
          'doj':obj.doj,
          'pic':obj.pic,
          'phn':obj.phn,
          'dob':obj.dob,
          'address':obj.address,
          'pincode':obj.pincode,
          'age':obj.age,
          'town':obj.town,
          'license':obj.license,
          'pancard':obj.pancard,
         
          // 'createdAt':firebase.firestore.FieldValue.serverTimestamp(),
          // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
       }).then(async docRef => {
         console.log(docRef.id);
         await this.firestore.doc(`School/${SchoolId}/Drivers/`+ docRef.id).update({
           'driverid':docRef.id})
       })
     }


     updateDriverData(driverid: string,obj: Driver,SchoolId:string){
      this.firestore.doc(`School/${SchoolId}/Drivers/` + driverid).update({
        'driverid':driverid,
          'aadhar':obj.aadhar,
          'name':obj.name,
          'doj':obj.doj,
          'pic':obj.pic,
          'phn':obj.phn,
          'dob':obj.dob,
          'address':obj.address,
          'pincode':obj.pincode,
          'age':obj.age,
          'town':obj.town,
          'license':obj.license,
          'pancard':obj.pancard,
        // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
      });
     }
     deleteDriverData(driverid:string, SchoolId:string){    
      this.firestore.doc(`School/${SchoolId}/Drivers/`  + driverid).delete();
    }
    // insertImageDetails(imageDetails: any) {
    //   //this.imageDetailList.push(imageDetails);
    // }




    //teacher


    getTeacherData() {
      // return this.firestore.collection('Users',ref=> ref.orderBy('name')).snapshotChanges();
        return this.firestore.collection('Users', ref => ref.where("role", "==","teacher")).snapshotChanges();  
       
     }
 
     createTeacherData(obj: Teacher){
       return this.firestore.collection('Users').add(
         {
           'id':'',
           'age':obj.age,
           'name':obj.name,
           'role':obj.role,
           'doj':obj.doj,
           'phn':obj.phn,
           'dob':obj.dob,
           'address':obj.address,
           'img':obj.img,
           'email':obj.email,
           'status':obj.status,
           'qualification':obj.qualification,
           'gender':obj.gender,
           'school':localStorage.getItem('school_id')
           // 'createdAt':firebase.firestore.FieldValue.serverTimestamp(),
           // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
        }).then(async docRef => {
          console.log(docRef.id);
          await this.firestore.doc('Users/' + docRef.id).update({
            'id':docRef.id})
        })
      }
 
      updateTeacherData(id: string,obj: Teacher){
       this.firestore.doc('Users/' + id).update({
         'id':id,
         
         'age':obj.age,
         'name':obj.name,
         'role':obj.role,
         'doj':obj.doj,
         'phn':obj.phn,
         'dob':obj.dob,
         'address':obj.address,
         'img':obj.img,
         'email':obj.email,
         'status':obj.status,
         'qualification':obj.qualification,
         'gender':obj.gender,
         // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
       });
      }
      deleteTeacherData(dataId: string){    
       this.firestore.doc('Users/' + dataId).delete();
     }
    //  insertImageDetails(imageDetails: any) {
    //    //this.imageDetailList.push(imageDetails);
    //  }


//teacher


getScoreData(SchoolId: string,ScoreId:string) {
  return this.firestore.collection(`School/${SchoolId}/Score/${ScoreId}/Comprehension`).snapshotChanges();
 
 }
 getKgsheetQuestionsData(SchoolId: string,ScoreId:string) {
  return this.firestore.collection(`School/${SchoolId}/Score/${ScoreId}/KG_Sheet`).snapshotChanges();
 
 }

 getComprehensionData(SchoolId: string) {
  return this.firestore.collection(`Grammar/${SchoolId}/Comprehension`,ref => ref.orderBy('no')).snapshotChanges();
 }


 getComprehensionQuestionsData(SchoolId: string, comprehensionId: string) {
  return this.firestore.collection(`Grammar/${SchoolId}/Comprehension/${comprehensionId}/Questions`,ref => ref.orderBy('qno')).snapshotChanges();
}


// getKgsheetQuestionsData(SchoolId: string, comprehensionId: string) {
//   return this.firestore.collection(`Grammar/${SchoolId}/Comprehension/${comprehensionId}/KG_Sheet`).snapshotChanges();
// }

getListData(kgSheetId: string): Observable<any[]> {
  return this.firestore.collection(`KG_Sheet/${kgSheetId}/List`, ref => ref.orderBy('name', 'asc')).snapshotChanges();

 }


//  getComprehensionQuestionsData(garamerID: string, compid: string) {
//   const path = `Grammar/${garamerID}/Comprehension/${compid}/Questions`;
//   console.log('Query Path:', path);
//   return this.firestore.collection(path).snapshotChanges();
// }
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



// details
getMarkData(schoolId: string): Observable<any[]> {
  // Assuming 'Test_Marks' is the collection name
  return this.firestore.collection(`School/${schoolId}/Test_Marks`).valueChanges();
}
gettestData(SchoolId: string) {
  return this.firestore.collection(`School/${SchoolId}/Test_Name`).snapshotChanges();

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




