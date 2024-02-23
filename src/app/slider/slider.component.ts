import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Inject,
  Input,
  OnInit,
  QueryList,
  ViewChild,
} from '@angular/core';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import { debounceTime, fromEvent, merge, takeUntil, timer } from 'rxjs';
import { SlideComponent } from './slide/slide.component';
import { ISlideStyle } from './models/slide-style.interface';
import { DOCUMENT } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent
  extends UnsubscribeAbstract
  implements AfterViewInit
{
  @ContentChildren(SlideComponent) slides!: QueryList<SlideComponent>;
  @ViewChild('wrapper') wrapper!: ElementRef<HTMLElement>;

  // Inputs
  @Input() height: number | 'auto' = 'auto';
  @Input() slidesPerView: number = 1;
  @Input() slidesToScroll: number = 1;
  @Input() gap: number = 0;
  @Input() speed: number = 500;

  // Slide buttons
  @Input() nextBtn?: unknown;
  @Input() prevBtn?: unknown;

  get nextBtnEl() {
    return !this.nextBtn
      ? undefined
      : this.nextBtn instanceof HTMLElement
      ? this.nextBtn
      : (<ElementRef<HTMLElement>>this.nextBtn).nativeElement;
  }

  get prevBtnEl() {
    return !this.prevBtn
      ? undefined
      : this.prevBtn instanceof HTMLElement
      ? this.prevBtn
      : (<ElementRef<HTMLElement>>this.prevBtn).nativeElement;
  }

  // Width
  private slideWidth: number = 0;
  private scrollWidth: number = 0;
  private trackWidth: number = 0;

  get sliderWidth() {
    return this.el.nativeElement.offsetWidth;
  }

  // Index
  private activeIndex: number = 0;
  get maxIndex() {
    return this.slides.length - this.slidesPerView;
  }

  // Translate
  private translate: number = 0;
  translateX: string = '';

  // Drag
  isDragging: boolean = false;
  private startDragging: boolean = false;
  private startX: number = 0;
  private draggedPath: number = 0;

  // Event listeners
  private resize$ = fromEvent(window, 'resize');
  private dragEndEvents$ = merge(
    fromEvent(this.document, 'mouseup'),
    fromEvent(this.document, 'touchend')
  );
  private dragMoveEvents$ = merge(
    fromEvent(this.document, 'mousemove'),
    fromEvent(this.document, 'touchmove')
  );

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.onResize();

    this.updateWidth();

    this.onNavigationButtonClick();
    this.onDocumentDragEvents();
  }

  // On resize
  private onResize(): void {
    this.resize$
      .pipe(debounceTime(500), takeUntil(this.ngUnsubscribe$))
      .subscribe((e) => {
        this.updateWidth();
        this.slideTo(this.activeIndex);
        // console.log(this.activeIndex);
      });
  }

  // Navigation
  private onNavigationButtonClick(): void {
    if (this.prevBtnEl) {
      fromEvent(this.prevBtnEl, 'click')
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => {
          this.handleSlideScroll('prev');
        });
    }

    if (this.nextBtnEl) {
      fromEvent(this.nextBtnEl, 'click')
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => {
          this.handleSlideScroll('next');
        });
    }
  }

  private handleNavigation(disable: boolean, type?: 'prev' | 'next'): void {
    if (!this.prevBtnEl || !this.nextBtnEl) {
      return;
    }

    if (
      !(this.prevBtnEl instanceof HTMLButtonElement) ||
      !(this.nextBtnEl instanceof HTMLButtonElement)
    ) {
      return;
    }

    if (type === 'prev') {
      this.prevBtnEl.disabled = disable;
    }

    if (type === 'next') {
      this.nextBtnEl.disabled = disable;
    }

    this.prevBtnEl.disabled = this.activeIndex <= 0 ? true : disable;
    this.nextBtnEl.disabled =
      this.activeIndex >= this.maxIndex ? true : disable;
  }

  private lockNavigation(): void {
    this.handleNavigation(true);

    timer(this.speed)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.handleNavigation(false);
      });
  }

  // Drag
  dragStart(e: MouseEvent | TouchEvent): void {
    this.startX = e instanceof MouseEvent ? e.pageX : e.touches[0].clientX;
    this.startDragging = true;

    this.handleNavigation(true);
  }

  private dragging(e: MouseEvent | TouchEvent): void {
    if (!this.startDragging) return;

    const distance = e instanceof MouseEvent ? e.pageX : e.touches[0].clientX;

    this.isDragging = true;

    this.draggedPath = this.translate - (distance - this.startX);

    if (
      this.draggedPath > this.trackWidth + (this.slideWidth + this.gap) ||
      this.draggedPath < (this.slideWidth + this.gap) * -1
    ) {
      return;
    }

    this.setTranslateX(this.draggedPath);
  }

  private dragStop(): void {
    if (!this.startDragging) return;

    this.isDragging = false;
    this.startDragging = false;
    this.handleNavigation(false);

    this.activeIndex = Math.round(
      this.draggedPath / (this.slideWidth + this.gap)
    );

    this.handleSlideScroll();
  }

  private onDocumentDragEvents(): void {
    this.dragEndEvents$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((e) => {
      this.dragStop();
    });

    this.dragMoveEvents$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((e) => {
      this.dragging(<MouseEvent | TouchEvent>e);
    });
  }

  // Update values
  private updateWidth(): void {
    this.lockNavigation();

    const defaultWidth = this.sliderWidth / this.slidesPerView;
    const widthWithGap =
      (this.sliderWidth - this.gap * (this.slidesPerView - 1)) /
      this.slidesPerView;

    this.slideWidth =
      this.gap > 0 && this.slidesPerView > 1 ? widthWithGap : defaultWidth;

    this.scrollWidth = this.slideWidth + this.gap;
    this.trackWidth =
      (this.slideWidth + this.gap) * (this.slides.length - this.slidesPerView) -
      this.gap;

    const style: ISlideStyle = {
      width: this.slideWidth,
      marginRight: this.gap,
      speed: this.speed,
    };

    this.slides.forEach((slide) => {
      slide.setStyle(style);
    });
  }

  // Slide scroll
  private handleSlideScroll(direction?: 'prev' | 'next'): void {
    if (direction === 'next') {
      this.nextSlide();
      return;
    }

    if (direction === 'prev') {
      this.prevSlide();
      return;
    }

    if (this.activeIndex > this.maxIndex) {
      this.activeIndex = this.maxIndex;
    }

    if (this.activeIndex < 0) {
      this.activeIndex = 0;
    }

    this.slideTo(this.activeIndex);
  }

  private nextSlide(): void {
    if (this.maxIndex - this.activeIndex < this.slidesToScroll) {
      this.activeIndex += this.maxIndex - this.activeIndex;
    } else {
      this.activeIndex += this.slidesToScroll;
    }

    this.slideTo(this.activeIndex);
  }

  private prevSlide(): void {
    if (this.activeIndex < this.slidesToScroll) {
      this.activeIndex = 0;
    } else {
      this.activeIndex -= this.slidesToScroll;
    }

    this.slideTo(this.activeIndex);
  }

  private slideTo(index: number): void {
    if (this.isDragging) return;

    this.lockNavigation();

    this.translate = Math.abs(this.scrollWidth * index);
    this.setTranslateX(this.translate);
  }

  // Slide styles
  private setTranslateX(path: number): void {
    this.translateX = `translateX(${path < 0 ? Math.abs(path) : '-' + path}px)`;
  }
}
