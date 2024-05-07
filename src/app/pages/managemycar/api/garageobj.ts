

// class Garages {

import { GeoPoint } from "firebase/firestore";





  export  class Garage {
    id: string='';
    name: string='';
    address: string='';
    postcode: string='';
    about: string='';
    openinghrs: string='';
    notes:string='';
    picture:string='';
    phone:string='';
    email:string='';
    siteno:string='';
    town:string='';
    location: GeoPoint = new GeoPoint(0, 0);
  }

