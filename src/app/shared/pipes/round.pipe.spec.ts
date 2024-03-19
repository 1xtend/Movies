import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoundPipe } from './round.pipe';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <span class="round">{{ number | round }}</span>
    <span class="ceil">{{ number | round : 'ceil' }}</span>
    <span class="floor">{{ number | round : 'floor' }}</span>
  `,
})
class HostComponent {
  number = 1.6;
}

describe('RoundPipe', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoundPipe, HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should round number if type is not provided', () => {
    const roundEl = fixture.debugElement.query(By.css('.round'));
    expect(roundEl.nativeElement.textContent.trim()).toBe('');
    fixture.detectChanges();
    expect(roundEl.nativeElement.textContent.trim()).toBe('2');
  });

  it('should floor number if type is floor', () => {
    const floorEl = fixture.debugElement.query(By.css('.floor'));
    expect(floorEl.nativeElement.textContent.trim()).toBe('');
    fixture.detectChanges();
    expect(floorEl.nativeElement.textContent.trim()).toBe('1');
  });

  it('should ceil number if type is floor', () => {
    const ceilEl = fixture.debugElement.query(By.css('.ceil'));
    expect(ceilEl.nativeElement.textContent.trim()).toBe('');
    fixture.detectChanges();
    expect(ceilEl.nativeElement.textContent.trim()).toBe('2');
  });
});
