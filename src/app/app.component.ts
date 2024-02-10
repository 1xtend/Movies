import { Component, OnInit } from '@angular/core';
import { MediaService } from './shared/services/media.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  openDrawer: boolean = false;

  constructor(private mediaService: MediaService) {}

  ngOnInit(): void {
    this.mediaService.getPopularMovies().subscribe((res) => {
      console.log(res);
    });
  }

  onToggle() {
    this.openDrawer = !this.openDrawer;
  }
}
