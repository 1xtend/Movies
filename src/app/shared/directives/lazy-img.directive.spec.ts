import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LazyImgDirective } from './lazy-img.directive';

@Component({
  template: ` <img [src]="testPath" alt="alt" appLazyImg class="img" /> `,
})
class HostComponent {}

describe('LazyImgDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, LazyImgDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have lazy attribute if supports', () => {
    const imgEl = fixture.debugElement.query(By.css('.img'));
    expect(imgEl.nativeElement.getAttribute('loading')).toBe('lazy');
  });
});
