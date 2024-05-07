
import { Injectable } from "@angular/core";
 
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as firebase from "firebase/compat";
import { Queries } from "./queriesobj";

import { Observable, map } from "rxjs";
import {Booking}from "./bookingobj";

import { UserData, Vehicle } from "./userobj";
import { Comprehension } from "../../gramar/api/comprehensionobj";
import { serverTimestamp } from "firebase/firestore";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Garage } from "./garageobj";

@Injectable({
  providedIn: 'root'
})


  export class ApiService {
  getUserById(id: string) {
    throw new Error('Method not implemented.');
  }

 
    constructor(private firestore: AngularFirestore,private http: HttpClient) {}
 
    //Get the address-book collection data
    // getAddressBookData() {
    //  // return this.firestore.collection('Users',ref=> ref.orderBy('name')).snapshotChanges();
    //    return this.firestore.collection('Users', ref => ref.where("role", "==", "student") && ref => ref.orderBy('name')).snapshotChanges();  
     
    // }


    getUsers(): Observable<any> {
      const url = 'https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/users';
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer api-token-1'
        })
      };
      return this.http.get<any>(url, httpOptions);
    }


    getbanner(): Observable<any> {
      const url = 'https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/getAllWelcomebanner';
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer api-token-1'
        })
      };
      return this.http.get<any>(url, httpOptions);
    }

    
    getGarages(): Observable<any> {
      const url = 'https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/getAllGarages';
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer api-token-1'
        })
      };
      return this.http.get<any>(url, httpOptions);
    }
    getGaragesid(id:string): Observable<any> {
      const url = `https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/getGarageById/${id}`;
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer api-token-1'
        })
      };
      return this.http.get<any>(url, httpOptions);
    }

    getBooking(): Observable<any> {
      const url = 'https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/getAllBookings';
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer api-token-1'
        })
      };
      return this.http.get<any>(url, httpOptions);
    }

    getvehicles(): Observable<any> {
      const url = 'https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/getvehicles';
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer api-token-1'
        })
      };
      return this.http.get<any>(url, httpOptions);
    }




    getAddressBookData() {
      return this.firestore.collection('booking',).snapshotChanges();
    }
  

    getusersData() {
      return this.firestore.collection('users',).snapshotChanges();
    }
    getVehiclesData() {
      return this.firestore.collection('vehicles',).snapshotChanges();
    }
    getGarageData() {
      return this.firestore.collection('garages',).snapshotChanges();
    }

    getServiceData(bookId: string): Observable<any[]> {
    return this.firestore.collection(`booking/${bookId}/services`).valueChanges();
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
          'userid':obj.userid,
          'vehicleId':obj.vehicleId,
          'garageid':obj.garageid,
          'createdAt':serverTimestamp(),
          'updatedAt':serverTimestamp(),
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
        'userid':obj.userid,
        'vehicleId':obj.vehicleId,
        'garageid':obj.garageid,
        'updatedAt':serverTimestamp(),
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
//     createGaragesData(garageDataArray: Garage[]): Promise<void[]> {
//   const promises: Promise<void>[] = [];

//   garageDataArray.forEach((garageData: Garage) => {
//     const promise = this.firestore.collection('garages').add({
//       'about': garageData.about,
//       'address': garageData.address,
//       'picture': garageData.picture,
//       'notes': garageData.notes,
//       'name': garageData.name,
//       'openinghrs': garageData.openinghrs,
//       'phone': garageData.phone,
//       'email': garageData.email,
//       'siteno': garageData.siteno,
//       'postcode': garageData.postcode,
//     }).then(async docRef => {
//       console.log(docRef.id);
//       await this.firestore.doc('garages/' + docRef.id).update({
//         'id': docRef.id
//       });
//     });

//     promises.push(promise);
//   });

//   return Promise.all(promises);
// }


createGaragesData(garageData: Garage){
  return this.firestore.collection('garages').add(
    {
      'about': garageData.about,
      'address': garageData.address,
      'picture': garageData.picture,
      'notes': garageData.notes,
      'name': garageData.name,
      'openinghrs': garageData.openinghrs,
      'phone': garageData.phone,
      'email': garageData.email,
      'siteno': garageData.siteno,

      'town': garageData.town,
      'location':garageData.location,

      'postcode': garageData.postcode,
      // 'createdAt':firebase.firestore.FieldValue.serverTimestamp(),
      // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
   }).then(async docRef => {
     console.log(docRef.id);
     await this.firestore.doc('garages/' + docRef.id).update({
       'id':docRef.id})
   })
 }


 
 updateGaragesData(id: string,garageData: Garage){
  this.firestore.doc('garages/' + id).update({
    'id':id,
    
    'about': garageData.about,
      'address': garageData.address,
      'picture': garageData.picture,
      'notes': garageData.notes,
      'name': garageData.name,

      'town': garageData.town,

      'openinghrs': garageData.openinghrs,
      'phone': garageData.phone,
      'email': garageData.email,
      'siteno': garageData.siteno,

      'location':garageData.location,


      'postcode': garageData.postcode,
   
  });
 }
 deleteTeacherData(dataId: string){    
  this.firestore.doc('garages/' + dataId).delete();
}


    //  updateGaragesData(id: string,obj: Garage){
    //   this.firestore.doc('garages/' + id).update({
    //     'id':id,
    //     'about':obj.about,
    //     'address':obj.address,
    //     'garageid':obj.garageid,
    //     'geolocation':obj.geolocation,
    //     'name':obj.name,
    //     'openinghrs':obj.openinghrs,
    //     'otherservices':obj.otherservices,
    //     'postcode':obj.postcode,
      
    //   });
    //  }
    //  deleteGaragestData(dataId: string){    
    //   this.firestore.doc('garages/' + dataId).delete();
    // }



    // createAppointments(garageId: string, obj: any) {
    //   return this.firestore.collection(`garages/${garageId}/appointments`).add({
    //     'driverid': '',
    //     'day': obj.day,
    //     'startime': obj.startime,
    //     'endtime': obj.endtime,
    //   }).then(async docRef => {
    //     console.log(docRef.id);
    //     await this.firestore.doc(`garages/${garageId}/appointments/` + docRef.id).update({
    //       'driverid': docRef.id
    //     })
    //   })
    // }

    createAppointment(garageId: string, appointmentData: any) {
      return this.firestore.collection(`garages/${garageId}/appointments`).add(appointmentData);
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
  const url = `https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/users`;
  return this.http.get(url);
  console.log(url)
  
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


createUserData(obj: UserData){
  return this.firestore.collection('users').add(
    {
      'id':'',
      'firstname':obj.firstname,
     
      'lastname':obj.lastname,
      'email':obj.email,
      'address':obj.address,
      'phone':obj.phone,
      'postcode':obj.postcode,
 
      // 'createdAt':firebase.firestore.FieldValue.serverTimestamp(),
      // 'updatedAt':firebase.firestore.FieldValue.serverTimestamp(),
   }).then(async docRef => {
     console.log(docRef.id);
     await this.firestore.doc('users/' + docRef.id).update({
       'id':docRef.id})
   })
 }


 updateUserData(id: string,obj: UserData){
  this.firestore.doc('users/' + id).update({
    'id':id,
    'firstname':obj.firstname,
      'lastname':obj.lastname,
      'email':obj.email,
      'address':obj.address,
      'phone':obj.phone,
      'postcode':obj.postcode,
     
  
  });
 }
 deleteUserData(dataId: string){    
  this.firestore.doc('users/' + dataId).delete();
}


//welcomebenner

getwelcomebennerData() {
  return this.firestore.collection('welcomebanner',).snapshotChanges();
}

  }
