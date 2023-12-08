import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Score } from '../api/scoreobj';
import { Comprehension } from '../../gramar/api/comprehensionobj';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent {
  breadCrumbItems!: Array<{}>;
  currentTab:any = "Profile"
  score:Score[]=[];
  SchoolId:string='stZWDh06GmAGgnoqctcE';
  ScoreId:string='4UwpeVOx1X4YofEWx3jq';
  GrammarId:string='XOO5IdohbzztfCg4GU6y';
  kgSheetId = '3u90Jik86R10JulNCU3K';
  dataSubscription: Subscription | null = null;
  comprehensions: Comprehension[] = [];
  rec_no: string | null;
  name: string | null;
  standard: string | null;
  section: string | null;
  Dob: Date | null;
  parentname: string | null;
  address: string | null;
  mobile: string | null;
  image: string | null;
  studentid: string | null;
  constructor(private route: ActivatedRoute,private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,) { 
  this.studentid= '';
  this.rec_no = '';
  this.name = '';
  this.standard = '';
  this.section = '';
  this.Dob = null;
  this.parentname = '';
  this.address = '';
  this.image = '';
  this.mobile = '';
}

 
  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {
      this.studentid = params.get('studentid');
      this.rec_no = params.get('rec_no');
      this.name = params.get('name');
      this.standard = params.get('standard');
      this.section = params.get('section');
      this.Dob = params.get('Dob') ? new Date(params.get('Dob')!) : null;
      this.parentname = params.get('parentname');
      this.address = params.get('address');
      this.mobile = params.get('mobile');
      this.image = params.get('image');

    });
    this.route.paramMap.subscribe((params) => {
      this.studentid = params.get('studentid');
      
      this.apiService.getScoreData(this.SchoolId, this.ScoreId).subscribe(actions => {
        this.score = actions.map(action => action.payload.doc.data() as Score);
        
        // Filter the score array based on the condition
        this.score = this.score.filter(score => score.stuid === this.studentid);
      });
    });
 

    this.dataSubscription = this.apiService.getComprehensionData(this.GrammarId).subscribe(
      (actions) => {
        this.comprehensions = actions.map((action) => action.payload.doc.data() as Comprehension);
      
      
   
        this.comprehensions.forEach(item => {
       
          const listId = item?.id; 
   
          if (listId) {
            console.log("Step 1.1: Entering loop for item with id", listId);
            this.apiService.getStandardsForList(this.SchoolId, this.kgSheetId, listId).subscribe(
            );
          }
        })
        
      },);
    this.breadCrumbItems = [{ label: 'Base UI' }, { label: 'Tabs', active: true }];
    
  }

  changeTab(tab: string) {
    this.currentTab = tab;
  }

  getcomp(compId: string): string {
    const driver = this.comprehensions.find((d) => d.id === compId);
    return driver ? driver.title :'No Driver Assign';
  }

  getcompno(compId: string): string {
    const driver = this.comprehensions.find((d) => d.id === compId);
    return driver ? String(driver.no) : 'No Driver Assign';
}

}
