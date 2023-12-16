import { Component } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ActivatedRoute } from '@angular/router';
import { Teacher } from '../api/teacherobj';

@Component({
  selector: 'app-teacher-details',
  templateUrl: './teacher-details.component.html',
  styleUrls: ['./teacher-details.component.scss']
})
export class TeacherDetailsComponent {
  Teachers: Teacher[] = [];
  teacherdetails:Teacher[] = [];
  teacherid:string |null;
  selectedTabIndex: number | null = null;
  SchoolId:string='stZWDh06GmAGgnoqctcE';
  constructor(private apiService: ApiService,private route: ActivatedRoute  ) {this.teacherid = ''}
  ngOnInit(){
    this.route.paramMap.subscribe((params) => {
      this.teacherid = params.get('teacherid');
 
      // this.selectedTabIndex = params.get('select') ? +params.get('select')! : null;
   
  
      this.apiService.getTeacherData().subscribe(actions => {
        this.Teachers = actions.map(action => action.payload.doc.data() as Teacher);
        this.teacherdetails=this.Teachers.filter(teacher => teacher.id === this.teacherid);
      });
      console.log(this.Teachers) 
    });
  
  }

}
