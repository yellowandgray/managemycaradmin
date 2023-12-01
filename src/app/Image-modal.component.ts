import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-image-modal',
  template: `

  <div class="modal-header ">
  <h1 class="modal-title">Image Preview</h1>
  <button type="button" class=" btn-close " aria-label="Close" (click)="bsModalRef.hide()">
   
  </button>
</div>
<div class="modal-body d-flex align-items-center justify-content-center text-center px-5">
  <img [src]="imageUrl" class="img-fluid" alt="Image" style="max-width: 100%; max-height: 100%; display: inline-block;">
</div>

  `,
})
export class ImageModalComponent {
  @Input() imageUrl: string = '';


  constructor(public bsModalRef: BsModalRef) {}
}
