import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IShow } from '@app/shared/models/shows/show.interface';

@Component({
  selector: 'app-show-dialog',
  templateUrl: './show-dialog.component.html',
  styleUrls: ['./show-dialog.component.scss'],
})
export class ShowDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public show: IShow) {}
}
