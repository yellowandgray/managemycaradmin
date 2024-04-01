

export class Garages {
   
     id:string='';
   
     about: string=''  ; 
     address:string='';  
     garageid: string='' ; 
     geolocation:string='' ; 
     name:string='';
     openinghrs:string='';
     otherservices:string='';
     postcode:string='';
    picture:string='';
    priceinfo:Priceinfo[]=[]; 
  
  }

  
export interface Priceinfo {
  id?: string;
  no:number;
  amount: string;
  desc: string;
  include: string;
  servicename: string;

}
