import {
  AfterViewInit,
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
import { fromEvent, takeUntil } from 'rxjs';
import { SlideComponent } from './slide/slide.component';
import { ISlideStyle } from './models/slide-style.interface';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent
  extends UnsubscribeAbstract
  implements AfterViewInit, OnInit
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
  @Input({ required: true }) nextBtn!: HTMLElement;
  @Input({ required: true }) prevBtn!: HTMLElement;

  private resize$ = fromEvent(window, 'resize');

  // Width
  private slideWidth: number = 0;
  private scrollWidth: number = 0;
  private trackWidth: number = 0;

  // Index
  private activeIndex: number = 0;
  private maxIndex: number = 0;

  // Translate
  private translate: number = 0;
  translateX: string = '';

  // Drag
  isDragging: boolean = false;
  private startX: number = 0;
  private draggedPath: number = 0;

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  ngOnInit(): void {
    this.onResize();
  }

  ngAfterViewInit(): void {
    this.updateWidth();
    this.onNavigationButtonClick();
    this.onDocumentMouseUp();
  }

  // On resize
  private onResize(): void {
    this.resize$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((e) => {
      this.updateWidth();
    });
  }

  // Navigation
  private onNavigationButtonClick(): void {
    fromEvent(this.prevBtn, 'click')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.handleSlideScroll('prev');
      });

    fromEvent(this.nextBtn, 'click')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.handleSlideScroll('next');
      });
  }

  private handleNavigation(disable: boolean, type?: 'prev' | 'next'): void {
    const next = <HTMLButtonElement>this.nextBtn;
    const prev = <HTMLButtonElement>this.prevBtn;

    if (type === 'next') {
      next.disabled = disable;
      return;
    }

    if (type === 'prev') {
      prev.disabled = disable;
      return;
    }

    prev.disabled = this.activeIndex <= 0 ? true : disable;
    next.disabled = this.activeIndex >= this.maxIndex ? true : disable;
  }

  private lockNavigation(): void {
    this.handleNavigation(true);

    const timeout = setTimeout(() => {
      this.handleNavigation(false);

      return () => {
        console.log('Clear timeout');
        clearTimeout(timeout);
      };
    }, this.speed);
  }

  // Drag
  dragStart(e: MouseEvent): void {
    this.isDragging = true;
    this.startX = e.pageX;

    this.handleNavigation(true);
  }

  dragging(e: MouseEvent): void {
    if (!this.isDragging) return;

    this.draggedPath = this.translate - (e.pageX - this.startX);

    if (
      this.draggedPath > this.trackWidth + (this.slideWidth + this.gap) ||
      this.draggedPath < (this.slideWidth + this.gap) * -1
    ) {
      return;
    }

    this.setTranslateX(this.draggedPath);
  }

  private dragStop(): void {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.handleNavigation(false);

    // if (this.draggedPath > (this.slideWidth + this.gap) * this.activeIndex) {
    //   this.activeIndex = Math.round(
    //     this.draggedPath / (this.slideWidth + this.gap)
    //   );
    // }

    // if (this.draggedPath < (this.slideWidth + this.gap) * this.activeIndex) {
    //   this.activeIndex = Math.round(
    //     this.draggedPath / (this.slideWidth + this.gap)
    //   );
    // }

    this.activeIndex = Math.round(
      this.draggedPath / (this.slideWidth + this.gap)
    );

    this.handleSlideScroll();
  }

  private onDocumentMouseUp(): void {
    fromEvent(this.document, 'mouseup')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.dragStop();
      });
  }

  // Update values
  private updateWidth(): void {
    this.lockNavigation();

    const parentWidth = this.wrapper.nativeElement.offsetWidth;
    const defaultWidth = parentWidth / this.slidesPerView;
    const widthWithGap =
      parentWidth - (this.gap * (this.slidesPerView - 1)) / this.slidesPerView;

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
