import { Component, Input } from '@angular/core';
import { IDetailsPerson } from '@app/shared/models/person/person.interface';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss'],
})
export class PersonDetailsComponent {
  @Input() person!: IDetailsPerson;
  @Input() profilePath!: string;
}