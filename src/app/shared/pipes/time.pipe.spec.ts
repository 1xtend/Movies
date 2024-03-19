import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimePipe } from './time.pipe';
import { By } from '@angular/platform-browser';

@Component({
  template: ` <span class="time">{{ time | time }}</span> `,
})
class HostComponent {
  time = 126;
}

fdescribe('TextCutPipe', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimePipe, HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should transform number to time', () => {
    const timeEl = fixture.debugElement.query(By.css('.time'));
    expect(timeEl.nativeElement.textContent.trim()).toBe('');
    fixture.detectChanges();
    expect(timeEl.nativeElement.textContent.trim()).toBe('2h 6m');
  });
});
