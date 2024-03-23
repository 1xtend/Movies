import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RandomBgColorDirective } from './random-bg-color.directive';

@Component({
  template: ` <div class="random" appRandomBgColor>Color</div> `,
})
class HostComponent {}

describe('RandomBgColorDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, RandomBgColorDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have random background color', () => {
    const divEl = fixture.debugElement.query(By.css('.random'));
    expect(divEl.nativeElement.style.backgroundColor).not.toBe('');
  });
});
