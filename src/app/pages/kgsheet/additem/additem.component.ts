import { Component } from '@angular/core';
import { Additems } from '../api/additemobj';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ApiService } from '../api/api.service';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})
export class AddItemComponent {
  breadCrumbItems!: Array<{}>;
  additems: Additems[] = [];
  items: any[] = [];
  constructor(private apiService: ApiService,private firestore: AngularFirestore) {}

  ngOnInit() {
    // Subscribe to the address-book collection data
    const kgSheetId = '3u90Jik86R10JulNCU3K';

    this.apiService.getAddItemData(kgSheetId).subscribe(actions => {
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
}
