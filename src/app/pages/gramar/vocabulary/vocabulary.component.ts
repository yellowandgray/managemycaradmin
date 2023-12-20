import { Component, ViewChild } from '@angular/core';
import { Vocabulary } from '../api/comprehensionobj';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs';

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
  uploading: boolean = false;
  selectedPreviewImage: string | null = null;
  @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  // @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  @ViewChild('showModals', { static: false }) showModals?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;
  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage )
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
}
