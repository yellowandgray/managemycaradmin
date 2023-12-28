import { Component, ViewChild } from '@angular/core';
import { Vocabulary } from '../api/comprehensionobj';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs';
import { ExcelService } from './excel.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-vocabulary',
  templateUrl: './vocabulary.component.html',
  styleUrls: ['./vocabulary.component.scss']
})
export class VocabularyComponent {
  breadCrumbItems!: Array<{}>;
  vocabulary: Vocabulary[] = [];
  emp: Vocabulary = new Vocabulary();
  GrammarId:string='XOO5IdohbzztfCg4GU6y';
  MessageFormData: FormGroup;
  image_path: string = '';
  selectedImage: any = null;
  imgSrc: string='';
  deleteId:string='';
  searchTerm: string = '';
  filteredvocabulary:  Vocabulary[] = [];
  uploading: boolean = false;
  selectedPreviewImage: string | null = null;
  @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  // @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  @ViewChild('showModals', { static: false }) showModals?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;
  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private excelService: ExcelService )
  {
   
    this.MessageFormData = new FormGroup({  
      'id': new FormControl('', Validators.required),  
      'desc': new FormControl('', Validators.required),  
      'name': new FormControl('', Validators.required),  
      
      'pic': new FormControl('', ),  

    });  
   

   
       
    if (this.emp != null) {

      this.MessageFormData.patchValue({       
        name: this.emp.name,
        desc: this.emp.desc,
        pic: this.emp.pic,
      
 
      });
      // this.key = this.data.data.key;
    
      this.emp.name= this.emp.name,
      this.emp.desc=this.emp.desc,
      this.emp.pic= this.emp.pic
     
    }
  } 

  ngOnInit() {
   
    this.apiService.getVocabularyData(this.GrammarId).subscribe(actions => {
      this.vocabulary = actions.map(action => action.payload.doc.data() as Vocabulary);
      this.filteredvocabulary = [...this.vocabulary];
     
    },(error) => {
      console.error('Error fetching arrivals', error);
  
    });
  }


  edit(index: number) {
    const selectedTeacher = this.vocabulary[index];
    this.emp = { ...selectedTeacher }; // Copy selected Teacher data to emp object
    
    this.MessageFormData.patchValue({
    desc: this.emp.desc,
    name: this.emp.name,
      // doj: this.emp.doj,
    
    });
    this.showModals?.show();
 
   
  }
  deletpop(id:string){
    this.deleteModal?.show()
    this.deleteId=id;

  }

  showImagePreview(imageUrl: string) {
    this.selectedPreviewImage = imageUrl;
    this.showModals1?.show(); // Show the modal
  }
  
  add(){
    this.MessageFormData;
    this.deleteRecordModal?.show()
     this.emp = new Vocabulary();
   
  }
  filteredTeacher(event: any): void {
    const value = event.target.value;
    console.log('Filtering by name...', value);
    this.searchTerm = value;
    this.filterTeacher();
  }
 
 
  filterTeacher() {
    console.log('Filtering...', this.searchTerm);


    this.filteredvocabulary = this.vocabulary.filter(vocabulary => {
     
      const nameMatch = !this.searchTerm || vocabulary.name.toLowerCase().includes(this.searchTerm.toLowerCase());


      return nameMatch;
    });


    if (!this.filteredvocabulary.length) {
      console.log('Nooo Students...');
      this.filteredvocabulary = [];
      console.log(this.filteredvocabulary);
    }
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
              this.emp.pic = url;
              console.log('imagePathsdb:', this.emp.pic );
              this.uploading = false; // Check if it's populated here
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

  update(id: string)
  {
    this.apiService.updatevocabularyData(id.toString(),this.emp,this.GrammarId);
    this.emp = new Vocabulary();
    this.showModals?.hide(); 
    // this.resetForm;

  }

  save() {


    if (this.selectedImage) {
      this.apiService.createVocabularyData(this.emp,this.GrammarId);
      this.emp = new Vocabulary();
    } else {
 
     this.apiService.createVocabularyData(this.emp,this.GrammarId);
      this.emp = new Vocabulary();
       
    }
    this.deleteRecordModal?.hide()
  }

  delet(id:string){
    this.apiService.deletevocabularyData(id,this.GrammarId)
    this.deleteModal?.hide()
  }

  importExcel(): void {
    // Trigger the file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }
  async onFileChange(event: any): Promise<void> {
    console.log("Step 1");
    const input = event.target;
    const file = input.files[0];
  
    if (file) {
      try {
        const data = await this.excelService.readExcel(file);
  
        // Check if data is not null, has more than minimumRows rows, and other conditions if needed
        if (data && data.length > 0 && data.length >= 5) {
          data.forEach(async (vavoca: any) => {
            const rec_no = vavoca[0];
            const dob1 = vavoca[3];
  
            if (rec_no != null && rec_no !== undefined) {
              // Parse Excel date value to JavaScript Date
              const excelDateValue = parseFloat(dob1);
              const jsDate = new Date((excelDateValue - 1) * 24 * 60 * 60 * 1000 + Date.UTC(1899, 11, 30));
              const formattedDate = jsDate.toLocaleDateString('en-CA');
  
              // Create Vocabulary object
              const studentData: Vocabulary = {
                id: '', // Ensure you handle the ID appropriately
                name: vavoca[0],
                pic: '', // You may need to handle image upload separately
                desc: vavoca[1],
              };
  
              console.log("student Data", studentData);
  
              // Assuming this.apiService.createVocabularyData returns a Promise
              await this.apiService.createVocabularyData(studentData, this.GrammarId);
              console.log('Vocabulary data created successfully');
            }
          });
        } else {
          console.error('File does not meet the minimum criteria for processing');
        }
      } catch (error) {
        console.error('Error reading Excel file or creating vocabulary data:', error);
      }
    }
  }
  downloadExcelTemplate(): void {
    const templateFileName = 'vocabulary_bulk_data_template.xlsx'; 
    const templateFilePath = 'student/vocabulary_bulk_data_template.xlsx'; 

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
  exportData() {
    // Create a copy of the array and modify it as needed
    const modifiedStudents = this.filteredvocabulary.map(Vocabulary => ({
     // Id: student.id,
    
      Name: Vocabulary.name,
      Description:Vocabulary.desc,
      // Mobile: student.phn,
      // DOB: student.dob,
      // DOJ:student.dob,
      // Address: student.address,
      // Gender: student.gender,
      // Status: student.status,
      // Qualification: student.qualification,
      // Email: student.email

      // Include or exclude fields as needed
    }));


    // Rearrange the order of fields if needed
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(modifiedStudents);


    // Create a workbook and append the modified worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vocabulary');


    // Trigger the download of the Excel file
    XLSX.writeFile(wb, 'exported_vocabulary.xlsx');
  
  }
}
