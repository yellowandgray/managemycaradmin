import { Component, ViewChild } from '@angular/core';
import { Additems } from '../api/additemobj';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ApiService } from '../api/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})
export class AddItemComponent {
  breadCrumbItems!: Array<{}>;
  additems: Additems[] = [];
  items: any[] = [];
  emp: Additems = new Additems();

  MessageFormData: FormGroup;
   kgSheetId = '3u90Jik86R10JulNCU3K';


   @ViewChild('addCourse', { static: false }) addCourse?: ModalDirective;
   @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  constructor(private apiService: ApiService,private firestore: AngularFirestore) {
    this.MessageFormData = new FormGroup({  
      'name': new FormControl('', Validators.required),   
      'punctuation': new FormControl('', Validators.required),      
      // 'active': new FormControl(''),
     
    });    
       
    if (this.emp != null) {
      this.MessageFormData.patchValue({       
        name: this.emp.name,
        punctuation: this.emp.punctuation,
      });
      this.emp.name= this.emp.name;  
      this.emp.punctuation= this.emp.punctuation; 
      this.emp.id= this.emp.id;   
    }
    
  }

  save() {
    
    //console.log(this.emp);  
     this.apiService.createAddItemData(this.emp,this.kgSheetId);
      this.emp = new Additems();
      this.addCourse?.hide();
      
   }
   delet(id: string){
   
    this.apiService.deleteAddItemData(id,this.kgSheetId)
      }

    update(id: string)
      {
        this.apiService.updateAddItemData(id.toString(),this.emp);
        this.emp = new Additems();
        this.deleteRecordModal?.hide(); 
   
      }

  ngOnInit() {
    // Subscribe to the address-book collection data
  

    this.apiService.getAddItemData(this.kgSheetId).subscribe(actions => {
      this.additems = actions.map(action => {
        const data = action.payload.doc.data() as Additems;
        return {
          name: data.name,
          picture: data.picture,
          punctuation: data.punctuation
        } as Additems;
      });
    });

    // this.apiService.getAddItemData(kgSheetId).subscribe(items => {
    //   this.items = items;
    //   console.log('Items:', this.items); // Print items to the console
    // });


  }

  editStudent(index: number) {
    const selectedStudent = this.additems[index];
    this.emp = { ...selectedStudent }; // Copy selected student data to emp object
    
    this.MessageFormData.patchValue({
    
      name: this.emp.name,
      punctuation:this.emp.punctuation,
     
    });
    this.deleteRecordModal?.show();
   
  }
}
