import { Component, Inject, ViewChild } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Student } from '../api/addressobj';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/internal/operators/finalize';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { parse } from 'date-fns';
import * as XLSX from 'xlsx';

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
  deleteId:string='';

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
//Set current Batch year here......
  selectedBatch: string = '2023-24';
  yearsArray=["2023-24","2024-25","2025-26"]


  selectedSection: string = '';
  searchTerm: string = '';
  filteredStudents: Student[] = [];
  studentNames: string[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  selectedStudentIndex: number | null = null;
  uploading: boolean = false;
  // private readonly fileName = 'student_bulk_data_template.xlsx';



  selectedPreviewImage: string | null = null;
  @ViewChild('showModals', { static: false }) showModals?: ModalDirective;




  @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;






//  routes: Routes = [




//     { path: 'addressbook/studentdetails/:name', component: StudentDetailsComponent },
//   ];
 


  constructor(private excelService: ExcelService,private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private router: Router, ) {
   
    this.MessageFormData = new FormGroup({  
      'number': new FormControl('', Validators.required),  
      'name': new FormControl('', Validators.required),      
      'Dob': new FormControl('', Validators.required),      
      'standard': new FormControl('', Validators.required),    
      'batch': new FormControl('', Validators.required),    
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
        batch: this.emp.batch,
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
      this.emp.batch = this.emp.batch;
      this.emp.image=this.emp.image;
      // this.emp.eyal_id= this.data.data.eyal_id;  
    }
    // getAddressBookData()
    
  }




 




  ngOnInit() {
    //Year Logic
  //  var year = new Date().getFullYear()
  //  console.log(year);
  //  this.yearsArray.forEach(element => {
  //   console.log(element);
  //   if(element.includes(year.toString()))
  //   {
  //     this.selectedBatch=element;
  //     console.log(element);
  //   }
  //  });
   //
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








  updateBatch(selectedBatch: string): void {
    this.emp.batch = selectedBatch;
}






  filterStudentsByName(event: any): void {
    const value = event.target.value;
    this.searchTerm = value;
    this.filterStudents();
  }
 
 
  filterStudents() {
  this.filteredStudents = this.students.filter(student => {
   // console.log("Selected Batch",this.selectedBatch);
    const batchMatch = !this.selectedBatch || student.batch === this.selectedBatch;
  //  console.log("Selected Batch",batchMatch);
    const standardMatch = !this.selectedStandard || student.standard === this.selectedStandard;
    const sectionMatch = !this.selectedSection || student.section === this.selectedSection;




   
  
    const nameMatch = this.searchTerm
      ? student.name.toLowerCase().startsWith(this.searchTerm.toLowerCase())
      : true;








    return batchMatch && standardMatch && sectionMatch && nameMatch;
  });
    this.currentPage = 1;








    // If there are no matches, set filteredStudents to an empty array
    if (!this.filteredStudents.length) {
      this.filteredStudents = [];
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
  }
 
  deletpop(id:string){
    this.deleteModal?.show()
     this.deleteId=id;




  }




  delet(id: string){
this.apiService.deleteStudentData(id)
this.deleteModal?.hide()
  }
  onsubmit(){
   
  }
  downloadExcelTemplate(): void {
    const templateFileName = 'student_bulk_data_template.xlsx'; 
    const templateFilePath = 'student/student_bulk_data_template.xlsx'; 

    const fileRef = this.storage.ref(templateFilePath);

    fileRef.getDownloadURL().subscribe((url) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = templateFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  showPreview(event: any) {
    this.uploading = true;
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
              this.uploading = false;
            });
          })
        ).subscribe(
          () => {
            console.log('Upload completed successfully');
          },
          (error) => {
            console.error('Upload error:', error);
            this.uploading = false;
          }
        );
      }
    }
    else {
      this.imgSrc = '/assets/images/image_placeholder.jpg';
      this.selectedImage = null;
      this.uploading = false;
    }
  }
  add(){
    this.MessageFormData;
    this.deleteRecordModal?.show()
    this.emp = new Student();
    this.emp.batch = this.selectedBatch;
  }
 
  save() {




console.log("student data",this.emp);
    if (this.selectedImage) {




      this.apiService.createStudentData(this.emp);
      this.resetFilters();
      this.emp = new Student();
    } else {
      // If no file is selected, save the item data without an image.
     
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
              data.forEach((student: any) => {
                  const rec_no = student[0];
                  const dob1 = student[3];
                  const dobDate = parse(dob1, 'dd-MM-yyyy', new Date());
                  if (rec_no != null && rec_no !== undefined) {  
                    console.log("Dob",dob1);              
                    const millisecondsPerDay = 24 * 60 * 60 * 1000;
                    const jsDate = new Date((dob1 - 1) * millisecondsPerDay + Date.UTC(1899, 11, 30));
        // Format the date as desired
        const formattedDate = dobDate.toLocaleDateString('en-CA');
                 // const formattedDate = jsDate.toLocaleDateString('en-CA');
                      const studentData: Student = {
                          rec_no: rec_no,
                          name: student[1],
                          standard: student[6],
                          section: student[7],
                          batch:student[8],
                          Dob: formattedDate,
                          parentname: student[5],
                          address: student[4],
                          mobile: student[2],
                          image: '',
                          id: '',
                          role: 'student',
                          school: ''
                      };
                      console.log("student DAta",studentData);
 
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


  exportData() {
    // Create a copy of the array and modify it as needed
    const modifiedStudents = this.filteredStudents.map(student => ({
     // Id: student.id,
     RecNo:student.rec_no,
      Name: student.name,
      Mobile: student.mobile,
      DOB: student.Dob,
      Address: student.address,
      ParentName: student.parentname,
      Standard: student.standard,
      Section: student.section,
      Batch: student.batch
      // Include or exclude fields as needed
    }));


    // Rearrange the order of fields if needed
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(modifiedStudents);


    // Create a workbook and append the modified worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');


    // Trigger the download of the Excel file
    XLSX.writeFile(wb, 'exported_students.xlsx');
    console.log("selected Batch",this.selectedBatch);
    console.log("selected Stadaed",this.selectedStandard);
    console.log("selected Section",this.selectedSection);
  }


}
