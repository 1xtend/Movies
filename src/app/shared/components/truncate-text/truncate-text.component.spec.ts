import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TruncateTextComponent } from './truncate-text.component';
import { TextCutPipe } from '@app/shared/pipes/text-cut.pipe';
import { getElementById } from 'src/testing';
import { DebugElement } from '@angular/core';

describe('TruncateTextComponent', () => {
  let fixture: ComponentFixture<TruncateTextComponent>;
  let component: TruncateTextComponent;

  let buttonEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TruncateTextComponent, TextCutPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(TruncateTextComponent);
    component = fixture.componentInstance;

    component.text = 'Long text';
    component.start = 0;
    component.end = 4;

    fixture.detectChanges();

    buttonEl = getElementById(fixture, 'text-button');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide button if text length is less than end input', () => {
    fixture.componentRef.setInput('end', 100);

    fixture.detectChanges();

    component.end = 100;

    const buttonEl = getElementById(fixture, 'text-button');
    expect(buttonEl).toBeNull();
  });

  it('should show full text on button click', () => {
    expect(component.isOpened).toBeFalse();
    buttonEl.triggerEventHandler('click', null);
    expect(component.isOpened).toBeTrue();

    fixture.detectChanges();

    const textEl = getElementById(fixture, 'text');
    expect(textEl.nativeElement.textContent.trim()).toBe('Long text');
  });

  it('should hide full text on button click', () => {
    component.isOpened = true;
    buttonEl.triggerEventHandler('click', null);
    expect(component.isOpened).toBeFalse();

    fixture.detectChanges();

    const textEl = getElementById(fixture, 'text');
    expect(textEl.nativeElement.textContent.trim()).toBe('Long...');
  });
});
