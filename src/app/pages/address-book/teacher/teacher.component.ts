import { Component, ViewChild } from '@angular/core';
import { Teacher } from '../api/teacherobj';
import { Subscription, finalize } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ApiService } from '../api/api.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent {
  breadCrumbItems!: Array<{}>;
 
  Teachers: Teacher[] = [];
  MessageFormData: FormGroup;
  emp: Teacher = new Teacher();
  filteredTeachers:  Teacher[] = [];
 
  emps: { image: string } = { image: '' }; // Assuming emp object has an image property
 
  //selectedImage: File | null = null;
  selectedFile: File | null = null;
  downloadURL: string | null = null;
  isSubmitted = false;
  deleteId:string='';
  files: File[] = [];
  loading: boolean = true;
          dataSubscription: Subscription | null = null;
  searchTerm: string = '';
  image_path: string = '';
  imgSrc: string='';
  selectedCategory: string = '';
  selectedImage: any = null;
  selectedPreviewImage: string | null = null;
  @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  @ViewChild('showModals', { static: false }) showModals?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;
  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage ) {
   
    this.MessageFormData = new FormGroup({  
      'age': new FormControl('', Validators.required),   
      'name': new FormControl('', Validators.required),      
      'dob': new FormControl('', Validators.required),      
      'doj': new FormControl('', Validators.required),      
      'phn': new FormControl('', Validators.required),      
      'email': new FormControl('', Validators.required), 
      'address': new FormControl('', Validators.required), 
      'status': new FormControl('', Validators.required), 
      'qualification': new FormControl('', Validators.required),   
      'gender': new FormControl('', Validators.required),     
      // 'active': new FormControl(''),
    });    
       
    if (this.emp != null) {

      this.MessageFormData.patchValue({       
        age: this.emp.age,
        name: this.emp.name,
        doj: this.emp.doj,
        email: this.emp.email,
        dob: this.emp.dob,
        gender: this.emp.gender,
        phn: this.emp.phn,
        status: this.emp.status,
        qualification: this.emp.qualification
        // img:this.emp.img,
 
      });
     
     

      this.emp.age= this.emp.age,
      this.emp.name= this.emp.name,
      this.emp.doj= this.emp.doj,
      this.emp. email=this.emp.email,
      this.emp. dob= this.emp.dob,
      this.emp.gender= this.emp.gender,
      this.emp.phn= this.emp.phn,
      this.emp.status= this.emp.status,
      this.emp.qualification= this.emp.qualification,
      this.emp.img=this.emp.img
      // this.emp.eyal_id= this.data.data.eyal_id;  
    }
    // getAddressBookData()
  }


  // ngOnInit() {
  //   // Subscribe to the address-book collection data
  //   this.apiService.getTeacherData().subscribe(actions => {
  //     this.filteredTeachers = actions.map(action => action.payload.doc.data() as Teacher);
  //   });
  // }


  ngOnInit() {
    this.loading= true;
    this.dataSubscription = this.apiService.getTeacherData().subscribe(
      (actions) => {
        this.Teachers = actions.map((action) => action.payload.doc.data() as Teacher);
        this.Teachers.sort((a, b) => a.name.localeCompare(b.name));
        this.filteredTeachers = [...this.Teachers];
        // this.populateStudentNames();
        this.loading = false; 
      },
      (error) => {
        console.error('Error fetching address book data:', error);
        this.loading = false; 
        // Handle the error appropriately, e.g., display a message to the user
      }
    );
  }

  delet(id: string){
this.apiService.deleteTeacherData(id)
this.deleteModal?.hide()
  }
  onsubmit(){
   
  }
 
  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
      this.image_path='';
      if (this.selectedImage != null) {
        var category = 'images';
        var filePath = `${category}/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.storage.ref(filePath);

        this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              this.emp.img = url;
              console.log('imagePathsdb:', this.emp.img ); // Check if it's populated here
            });
          })
        ).subscribe(
          () => {
            console.log('Upload completed successfully');
          },
          (error) => {
            console.error('Upload error:', error);
          }
        );
      }

    }
    else {
      this.imgSrc = '/assets/images/image_placeholder.jpg';
      this.selectedImage = null;
    }
  }
  

  save() {
    console.log(this.emp); 

    if (this.selectedImage) {
      this.apiService.createTeacherData(this.emp);
      this.emp = new Teacher(); 
    } else {
      // If no file is selected, save the item data without an image.
      console.log("Else Running");
     
     console.log(this.emp);  
     this.apiService.createTeacherData(this.emp);
      this.emp = new Teacher();
       
    }
    this.deleteRecordModal?.hide()
  }


  showImagePreview(imageUrl: string) {
    this.selectedPreviewImage = imageUrl;
    this.showModals1?.show(); // Show the modal
  }



   update(id: string)
   {
     this.apiService.updateTeacherData(id.toString(),this.emp);
     this.emp = new Teacher();
     this.showModals?.hide(); 
     this.resetForm;

   }
   
   editTeacher(index: number) {
    const selectedTeacher = this.Teachers[index];
    this.emp = { ...selectedTeacher }; // Copy selected Teacher data to emp object
    
    this.MessageFormData.patchValue({
     age: this.emp.age,
      name: this.emp.name,
      doj: this.emp.doj,
     email: this.emp.email,
      dob: this.emp.dob,
      gender: this.emp.gender,
      phn: this.emp.phn,
      status: this.emp.status,
      qualification: this.emp.qualification
    });
    this.showModals?.show();
    this.resetForm
   
  }
  
  onImageSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedImage = event.target.files[0];
    }
  }
  
  resetForm() {
    this.selectedImage = null;
    this.isSubmitted = false;
  }

  // filteredTeacher(): Teacher[] {
  //   if (!this.searchTerm.trim()) {
  //     return this.Teachers; // If search term is empty, return all items
  //   }
  
  //   return this.Teachers.filter(item => {
  //     return item.name.toLowerCase().includes(this.searchTerm.toLowerCase());
  //   });
  // }
  
  filteredTeacher(event: any): void {
    const value = event.target.value;
    console.log('Filtering by name...', value);
    this.searchTerm = value;
    this.filterTeacher();
  }
 
 
  filterTeacher() {
    console.log('Filtering...', this.searchTerm);


    this.filteredTeachers = this.Teachers.filter(teacher => {
     
      const nameMatch = !this.searchTerm || teacher.name.toLowerCase().includes(this.searchTerm.toLowerCase());


      return nameMatch;
    });


    if (!this.filteredTeachers.length) {
      console.log('Nooo Students...');
      this.filteredTeachers = [];
      console.log(this.filteredTeachers);
    }
  }


  add(){
    this.MessageFormData;
    this.deleteRecordModal?.show()
     this.emp = new Teacher();
   
  }

  deletpop(id:string){
    this.deleteModal?.show()
     this.deleteId=id;

  }

}
