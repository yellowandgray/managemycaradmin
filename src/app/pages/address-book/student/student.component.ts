



import { Component, Inject, ViewChild } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Student } from '../api/addressobj';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/internal/operators/finalize';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';




import { ExcelService } from './excel.service';
import { Subscription } from 'rxjs';
import { Router, Routes } from '@angular/router';
import { StudentDetailsComponent } from '../student-details/student-details.component';




@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent {
  [x: string]: any;
  breadCrumbItems!: Array<{}>;
 
  students: Student[] = [];
  MessageFormData: FormGroup;
  emp: Student = new Student();








 
  emps: { image: string } = { image: '' };
 
  //selectedImage: File | null = null;
  selectedFile: File | null = null;
  downloadURL: string | null = null;
  isSubmitted = false;
  files: File[] = [];
  dataSubscription: Subscription | null = null;
  image_path: string = '';
  imgSrc: string='';
  selectedImage: any = null;
  loading: boolean = true;


  selectedStandard: string = '';
  selectedSection: string = '';
  searchTerm: string = '';
  filteredStudents: Student[] = [];
  studentNames: string[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  selectedStudentIndex: number | null = null;




  selectedPreviewImage: string | null = null;
  @ViewChild('showModals', { static: false }) showModals?: ModalDirective;




  @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;


//  routes: Routes = [

//     { path: 'addressbook/studentdetails/:name', component: StudentDetailsComponent },
//   ];
 





  constructor(private excelService: ExcelService,private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private router: Router, ) {
   
    this.MessageFormData = new FormGroup({  
      'number': new FormControl('', Validators.required),  
      'name': new FormControl('', Validators.required),      
      'Dob': new FormControl('', Validators.required),      
      'standard': new FormControl('', Validators.required),      
      'mobile': new FormControl('', Validators.required),      
      'section': new FormControl('', Validators.required),
      'address': new FormControl('', Validators.required),  
      'parentname': new FormControl('', Validators.required),    
      // 'active': new FormControl(''),
    });    
       
    if (this.emp != null) {








      this.MessageFormData.patchValue({      
        name: this.emp.name,
        Dob: this.emp.Dob,
        address: this.emp.address,
        mobile: this.emp.mobile,
        section:  this.emp.section,  
        parentname:  this.emp.parentname,  
        standard:  this.emp.standard,  
        number: this.emp.rec_no,
        image:this.emp.image,
 
      });
      // this.key = this.data.data.key;
      this.emp.rec_no= this.emp.rec_no;
      this.emp.Dob= this.emp.Dob;  
      this.emp.name= this.emp.name;  
      this.emp.address= this.emp.address;
      this.emp.mobile= this.emp.mobile;  
      this.emp.parentname= this.emp.parentname;  
      this.emp.section= this.emp.standard;  
      this.emp.id= this.emp.id;  
      this.emp.standard= this.emp.standard;  
      this.emp.image=this.emp.image;
      // this.emp.eyal_id= this.data.data.eyal_id;  
    }
    // getAddressBookData()
  }

 

  ngOnInit() {
    this.loading= true;
    // Subscribe to the address-book collection data
    this.dataSubscription = this.apiService.getAddressBookData().subscribe(
      (actions) => {
        this.students = actions.map((action) => action.payload.doc.data() as Student);
        this.students.sort((a, b) => a.name.localeCompare(b.name));
        this.filterStudents();  // Add this line to apply initial filtering
        this.populateStudentNames();
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching address book data:', error);
        this.loading = false;
        // Handle the error appropriately, e.g., display a message to the user
      }
    );
  }


  displayFn(student: Student): string {
    return student && student.name ? student.name : '';
  }




  filterStudentsByName(event: any): void {
    const value = event.target.value;
    console.log('Filtering by name...', value);
    this.searchTerm = value;
    this.filterStudents();
  }
 
 
  filterStudents() {
    console.log('Filtering...', this.selectedStandard, this.selectedSection, this.searchTerm);




    // this.filteredStudents = this.students.filter(student => {
    //   const standardMatch = !this.selectedStandard || student.standard === this.selectedStandard;
    //   const sectionMatch = !this.selectedSection || student.section === this.selectedSection;
    //   const nameMatch = !this.searchTerm || student.name.toLowerCase().includes(this.searchTerm.toLowerCase());




    //   return standardMatch && sectionMatch && nameMatch;
    // });
   
  this.filteredStudents = this.students.filter(student => {
    const standardMatch = !this.selectedStandard || student.standard === this.selectedStandard;
    const sectionMatch = !this.selectedSection || student.section === this.selectedSection;
   
    // Check if the student's name contains the search term
    const nameMatch = this.searchTerm
      ? student.name.toLowerCase().startsWith(this.searchTerm.toLowerCase())
      : true;


    return standardMatch && sectionMatch && nameMatch;
  });
    this.currentPage = 1;


    // If there are no matches, set filteredStudents to an empty array
    if (!this.filteredStudents.length) {
      console.log('Nooo Students...');
      this.filteredStudents = [];
      console.log(this.filteredStudents);
    }
  }

  navigateToDetails(name: string) {
 
    this.router.navigate(['/studentdetails', name]);
  }
 
 
  showImagePreview(imageUrl: string) {
    this.selectedPreviewImage = imageUrl;
    this.showModals1?.show(); // Show the modal
  }
 
 
 
  populateStudentNames() {
    // Populate studentNames with unique student names
    this.studentNames = [...new Set(this.students.map(student => student.name))];
    console.log("student names ",this.studentNames);
  }
 








  // ngOnInit() {
  //   // Subscribe to the address-book collection data
  //   this.apiService.getAddressBookData().subscribe(actions => {
  //     this.students = actions.map(action => action.payload.doc.data() as Student);
  //   });
  // }
  delet(id: string){
this.apiService.deleteStudentData(id)
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
              this.emp.image = url;
              console.log('imagePathsdb:', this.emp.image ); // Check if it's populated here
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




  add(){
    this.MessageFormData;
    this.deleteRecordModal?.show()
    this.emp = new Student();
 
   
  }




 
// In your component class
// In your component class




// Initialize filteredStudents to show all students initially
















 
 
  save() {
    console.log(this.emp);








    if (this.selectedImage) {
      this.apiService.createStudentData(this.emp);
      this.resetFilters();
      this.emp = new Student();
    } else {
      // If no file is selected, save the item data without an image.
      console.log("Else Running");
     
     console.log(this.emp);  
     this.apiService.createStudentData(this.emp);
     this.resetFilters();
      this.emp = new Student();
       
    }
    this.deleteRecordModal?.hide()
  }








  importExcel(): void {
    // Trigger the file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }








  onFileChange(event: any): void {
    console.log("Step 1");
    const input = event.target;
    const file = input.files[0];
 
    if (file) {
      this.excelService.readExcel(file).then((data: any[]) => {
          // Check if data is not null, has more than minimumRows rows, and other conditions if needed
          if (data && data.length > 0 && data.length >= 5) {
              console.log("Step 2");
             // console.log("Student Dob ", data);
 
              data.forEach((student: any) => {
                  const rec_no = student[0];
                  const dob1 = student[3];
                //  console.log("Student Rec no ", student[1]);
 
                  // Check if rec_no is not null or undefined
                  if (rec_no != null && rec_no !== undefined) {
                 
                    const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const jsDate = new Date((dob1 - 1) * millisecondsPerDay + Date.UTC(1900, 0, 1));








        console.log("Student dob test ", jsDate);








        // Format the date as desired
        const formattedDate = jsDate.toLocaleDateString('en-CA');
       








                    console.log("Student dob ",formattedDate);
                      const studentData: Student = {
                          rec_no: rec_no,
                          name: student[1],
                          standard: student[6],
                          section: student[7],
                          Dob: formattedDate,
                          parentname: student[5],
                          address: student[4],
                          mobile: student[2],
                          image: '',
                          id: '',
                          role: 'student',
                          school: ''
                      };
                      console.log('rec_no:', studentData.rec_no);
                      console.log('rec_no:', student[6]);
 
                      this.apiService.createStudentData(studentData).then(
                          () => {
                              console.log('File uploaded successfully');
                          },
                          (error) => {
                              console.error('Error uploading file:', error);
                              console.log('File upload failed');
                          }
                      );
                  }
                  // else {
                  //     console.error('rec_no is null or undefined in a row');
                  // }
              });
          } else {
              console.error('File does not meet the minimum criteria for processing');
              console.log('File upload failed');
          }
      });
  }
  }
 
 
 
















   update(id: string)
   {
    if (this.selectedStudentIndex !== null) {
      this.apiService.updateStudentData(id.toString(), this.emp);
      this.emp = new Student();
      this.showModals?.hide();
      this.resetForm();
      this.resetFilters();
    }






   }
   
   editStudent(index: number) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const originalIndex = startIndex + index;
    console.log("orginal index",originalIndex)
    const selectedStudent = this.students.indexOf(this.filteredStudents[originalIndex]);
  this.selectedStudentIndex = selectedStudent;
  this.emp = { ...this.students[selectedStudent] };
  //  this.emp = { ...selectedStudent }; // Copy selected student data to emp object
   
    this.MessageFormData.patchValue({
      rec_no: this.emp.rec_no,
      name: this.emp.name,
      standard: this.emp.standard,
      section: this.emp.section,
      Dob: this.emp.Dob,
      parentname: this.emp.parentname,
      address: this.emp.address,
      mobile: this.emp.mobile
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
 
  resetFilters() {
    // Reset filter fields
    this.selectedStandard = '';
    this.selectedSection = '';
    this.searchTerm = '';
   // this.filteredStudents = [...this.students];
  }
  getVisibleItems(): Student[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredStudents.slice(startIndex, endIndex);
  }
 


 
  getTotalPages(): number {
    return Math.ceil(this.filteredStudents.length / this.itemsPerPage);
  }
 
  getPages(): number[] {
    return Array(this.getTotalPages()).fill(0).map((_, i) => i + 1);
  }
 
  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }




 
}

































