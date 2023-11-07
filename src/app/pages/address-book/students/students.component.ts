import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FuzzyList, ListJs, dataattribute, existingList, paginationlist,  } from './datas';

import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Validators } from 'ngx-editor';
//  import { studentModel } from './studen.model';
import { Observable } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
//  import { ListService } from './studentservice';
import { DecimalPipe } from '@angular/common';

import { ListJsModel } from './studentmodel';
import { NgbdListSortableHeader, listSortEvent } from './student-short';
import { ListService } from './studentserves';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class  StudentsComponent{
  breadCrumbItems!: Array<{}>;
  submitted = false;
  listJsForm!: UntypedFormGroup;
  ListJsData!: ListJsModel[];
  checkedList: any;
  masterSelected!: boolean;
  ListJsDatas: any;

  paginationDatas: any;
  attributedata: any;
  existingData: any;
  fuzzyData: any;

  existingTerm: any;
  fuzzyTerm: any;
  dataterm: any;
  term: any;

  // Table data
  ListJsList!: Observable<ListJsModel[]>;
  total: Observable<number>;
  @ViewChildren(NgbdListSortableHeader) headers!: QueryList<NgbdListSortableHeader>;
    @ViewChild('showModals', { static: false }) showModals?: ModalDirective;
    @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;
  constructor(public service: ListService, private formBuilder: UntypedFormBuilder, private pipe: DecimalPipe) {
    this.ListJsList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Tables' },
      { label: 'student', active: true }
    ];

    /**
   * Form Validation
   */
    this.listJsForm = this.formBuilder.group({
      ids: [''],
      customer_name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      date: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });


    /**
     * fetches data
     */
    this.ListJsList.subscribe((x: any) => {
      this.ListJsDatas = Object.assign([], x);
    });
    this.attributedata = dataattribute
    this.existingData = existingList
    this.fuzzyData = FuzzyList
    this.paginationDatas = paginationlist

    this.paginationDatas = paginationlist.slice(0, 3);
    this.ListJsDatas = ListJs.slice(0, 8);
  }

  tablepageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.ListJsDatas = ListJs.slice(startItem, endItem);
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.paginationDatas = paginationlist.slice(startItem, endItem);
  }

  /**
   * Form data get
   */
  get form() {
    return this.listJsForm.controls;
  }

  /**
  * Save saveListJs
  */
  saveListJs() {
    if (this.listJsForm.valid) {
      if (this.listJsForm.get('ids')?.value) {
        this.ListJsDatas = this.ListJsDatas.map((data: { id: any; }) => data.id === this.listJsForm.get('ids')?.value ? { ...data, ...this.listJsForm.value } : data)
      } else {
        const customer_name = this.listJsForm.get('customer_name')?.value;
        const email = this.listJsForm.get('email')?.value;
        const phone = this.listJsForm.get('phone')?.value;
        const date = '14 Apr, 2021';
        const status_color = "success";
        const status = this.listJsForm.get('status')?.value;
        ListJs.push({
          id: this.ListJsDatas.length + 1,
          customer_name,
          email,
          phone,
          date,
          status_color,
          status,
          isSelected: false
        });

      }
    }
    this.showModals?.hide()
    setTimeout(() => {
      this.listJsForm.reset();
    }, 2000);
    this.submitted = true
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.ListJsDatas.forEach((x: { state: any; }) => x.state = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.ListJsDatas.length; i++) {
      if (this.ListJsDatas[i].state == true) {
        result = this.ListJsDatas[i].id;
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";

  }
  isAllChecked() {
    return this.ListJsDatas.every((_: { state: any; }) => _.state);
  }

  /**
  * Confirmation mail model
  */
  deleteId: any;
  confirm(id: any) {
    this.deleteId = id;
    this.deleteModal?.show();
  }


  /**
  * Multiple Delete
  */
  checkedValGet: any[] = [];

  // Delete Data
  deleteData(id: any) {
    if (id) {
      document.getElementById('a_' + id)?.remove();

    }
    this.checkedValGet.forEach((item: any) => {
      document.getElementById('a_' + item)?.remove();
      this.masterSelected = false;
    });

    this.deleteModal?.hide();
  }

  /**
  * Open modal
  * @param content modal content
  */
  editModal(id: any) {
    this.submitted = false;
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;

    updateBtn.innerHTML = "Update";
    this.showModals?.show()
    var listData = this.ListJsDatas[id];
    this.listJsForm.controls['customer_name'].setValue(listData.customer_name);
    this.listJsForm.controls['email'].setValue(listData.email);
    this.listJsForm.controls['phone'].setValue(listData.phone);
    this.listJsForm.controls['date'].setValue(listData.date);
    this.listJsForm.controls['status'].setValue(listData.status);
    this.listJsForm.controls['ids'].setValue(listData.id);
  }

  // Sorting
  sortname() {
    this.ListJsDatas.sort(function (a: any, b: any) {
      if (a.firstname < b.firstname) { return -1; }
      if (a.firstname > b.firstname) { return 1; }
      return 0;
    })
  }

  /**
* Sort table data
* @param param0 sort the column
*
*/
onSort({ column, direction }: listSortEvent) {
  // resetting other headers
  this.headers.forEach(header => {
    if (header.listsortable !== column) {
      header.direction = '';
    }
  });

  this.service.sortColumn = column;
  this.service.sortDirection = direction;
}
}
