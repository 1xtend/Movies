import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextCutPipe } from './text-cut.pipe';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <span class="cut">{{ text | textCut : 0 : 5 }}</span>
    <span class="not-cut">{{ text | textCut : 0 : 50 }}</span>
  `,
})
class HostComponent {
  text = 'Lorem ipsum.';
  shortText = 'Lorem';
}

describe('TextCutPipe', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextCutPipe, HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cut text', () => {
    const cutEl = fixture.debugElement.query(By.css('.cut'));
    expect(cutEl.nativeElement.textContent.trim()).toBe('');
    fixture.detectChanges();
    expect(cutEl.nativeElement.textContent.trim()).toBe('Lorem...');
  });

  it('should not cut text if its length is shorter than provided end value ', () => {
    const notCutEl = fixture.debugElement.query(By.css('.not-cut'));
    expect(notCutEl.nativeElement.textContent.trim()).toBe('');
    fixture.detectChanges();
    expect(notCutEl.nativeElement.textContent.trim()).toBe('Lorem ipsum.');
  });
});
