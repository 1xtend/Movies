import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LazyImgDirective } from './lazy-img.directive';

const testPath = 'https://picsum.photos/200';

@Component({
  template: ` <img [src]="testPath" alt="alt" appLazyImg class="img" /> `,
})
class HostComponent {}

fdescribe('LazyImgDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, LazyImgDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have lazy attribute if supports', () => {
    const imgEl = fixture.debugElement.query(By.css('.img'));
    expect(imgEl.nativeElement.getAttribute('loading')).toBe('lazy');
  });
});
