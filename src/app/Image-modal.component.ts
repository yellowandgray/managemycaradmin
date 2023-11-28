import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-image-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Image Preview</h4>
      <button type="button" class="close" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body text-center">
      <img [src]="imageUrl" class="img-fluid" alt="Image" style="max-width: 70%; max-height: 80%; display: inline-block;">
    </div>
  `,
})
export class ImageModalComponent {
  @Input() imageUrl: string = '';


  constructor(public bsModalRef: BsModalRef) {}
}
