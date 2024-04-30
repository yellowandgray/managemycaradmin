import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs';


class Banner {
  id: string='';
  active: boolean = false;
  tittle: string = '';
  subtittle: string[] = []; 
  pic: string = '';
}
@Component({
  selector: 'app-welcome-banner',
  templateUrl: './welcome-banner.component.html',
  styleUrls: ['./welcome-banner.component.scss']
})

  export class WelcomeBannerComponent implements OnInit {
    loading: boolean = true;
    breadCrumbItems!: Array<{}>;
    uploading: boolean = false;
    selectedImage: any = null;
    subtitleInput: string = ''; 


    banner: Banner = {
      id:'',
      pic: '',
      subtittle: [],
      tittle: '',
      active:true
    };

    subtittles: { tittles: string }[] = [];
    usersdata: any = []; 
    selectedStandard: string = '';
    image_path: string = '';
    imgSrc: string='';
    @ViewChild('showModals', { static: false }) showModals?: ModalDirective;
    @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;


    constructor(private apiService: ApiService,private http: HttpClient,private storage: AngularFireStorage) {this. addSubtitles() }
  
    ngOnInit(): void {
      this.apiService.getwelcomebennerData().subscribe(actions => {
        this.usersdata = actions.map(action => action.payload.doc.data() );
      });
      this.loading = false;
      // this.apiService.getbanner().subscribe(
      //   (response) => {
      //     console.log(response);
      //     if (response && response.status === 'Success' && response.data) {
      //       this.usersdata = response.data; 
      //       console.log(this.usersdata)
      //       this.loading = false;
      //     } else {
      //       console.error('Invalid response format:', response);
      //       this.loading = false;
      //     }
      //   },
      //   (error) => {
      //     console.error('Error fetching banners: ', error);
      //     this.loading = false;
      //   }
      // );
    }
    
    
    addSubtitles() {
      console.log(this.subtittles,'check')
      this.subtittles.push({ tittles: '' });
    }


 
removeSubtitle(index: number) {
  this.banner.subtittle.splice(index, 1);
}  


    save() {
      this.banner.subtittle = this.subtittles.map(sub => sub.tittles);
      console.log(    this.banner.subtittle)
      const formData = {
        tittle: this.banner.tittle, 
        subtittle: this.banner.subtittle, 
        active: this.banner.active,
        pic: this.banner.pic 
      };
    console.log(formData);
      // HTTP options
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer api-token-1',
          'Content-Type': 'application/json'
        })
      };
    
      this.http.post('https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/createWelcomeBanner', formData, httpOptions)
        .subscribe(
          (response: any) => {
            console.log('Success:', response);
            this.deleteRecordModal!.hide();
            this.ngOnInit()
          },
          (error) => {
            console.error('Error:', error);
            this.deleteRecordModal!.hide();
            this.ngOnInit()
          }
        );
        this.ngOnInit()
    }

    showPreview(event: any) {
      this.uploading = true;
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.imgSrc = e.target.result;
        reader.readAsDataURL(event.target.files[0]);
        this.selectedImage = event.target.files[0];
        console.log(this.selectedImage)
        this.image_path='';
        if (this.selectedImage != null) {
          var category = 'images';
          var filePath = `${category}/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
          const fileRef = this.storage.ref(filePath);
          this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((url) => {
                console.log(url);
                this.banner.pic = url; // Storing the URL in garage.picture
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
        this.selectedImage = null;
        this.uploading = false;
      }
    }


    add(){
      this.banner = new Banner();
      this.subtittles = [];
      this.deleteRecordModal?.show()
   
    }


    edit(banner: Banner) {
      this.banner = { ...banner };
      console.log(this.banner)
      this.subtittles = this.banner.subtittle.map(sub => ({ tittles: sub }));
      this.showModals?.show();
    }


    delet(id: string) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer api-token-1',
        
        })
      };
  
      this.http.delete(`https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/welcomebannerdelete/${id}`, httpOptions)
        .subscribe(
          () => {
            console.log('Document deleted successfully');
            this.ngOnInit()
          },
          (error) => {
            console.error('Error deleting document:', error);
            this.ngOnInit()
          }
        );
        this.ngOnInit()
    }


    update(id: string) {
    
      this.banner.subtittle = this.subtittles.map(sub => sub.tittles);
      const formData = {
        tittle: this.banner.tittle,
        subtittle: this.banner.subtittle,
        active: this.banner.active,
        pic: this.banner.pic
      };
    
      // Log formData for debugging
      console.log(formData);
    
      // Define HTTP options including headers
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer api-token-1',
          'Content-Type': 'application/json'
        })
      };
    
      // Send HTTP PUT request with updated formData
      this.http.put(`https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/welcomebannerupdate/${id}`, formData, httpOptions)
        .subscribe(
          (response: any) => {
            console.log('Success:', response);
            // Hide modal and reload data
            this.deleteRecordModal?.hide();
            this.ngOnInit();
          },
          (error) => {
            console.error('Error:', error);
            // Hide modal and reload data on error
            this.deleteRecordModal?.hide();
            this.ngOnInit();
          }
        );
        this.ngOnInit();
       this.showModals?.hide()
    }
    

  }
