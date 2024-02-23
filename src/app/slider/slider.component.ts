import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  Inject,
  Input,
  QueryList,
  ViewChild,
} from '@angular/core';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  from,
  fromEvent,
  map,
  merge,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
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
  private isDraggingSubject = new BehaviorSubject<boolean>(false);
  isDragging$ = this.isDraggingSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private startDragging: boolean = false;
  private draggedPath: number = 0;

  // Event listeners
  private resize$ = fromEvent(window, 'resize');
  private mouseDown$ = fromEvent<MouseEvent>(
    this.el.nativeElement,
    'mousedown'
  ).pipe(takeUntil(this.ngUnsubscribe$));
  private mouseMove$ = fromEvent<MouseEvent>(this.document, 'mousemove').pipe(
    takeUntil(this.ngUnsubscribe$)
  );
  private mouseUp$ = fromEvent<MouseEvent>(this.document, 'mouseup').pipe(
    takeUntil(this.ngUnsubscribe$)
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
    this.sliderDragging();
  }

  // On resize
  private onResize(): void {
    this.resize$
      .pipe(debounceTime(500), takeUntil(this.ngUnsubscribe$))
      .subscribe((e) => {
        this.updateWidth();
        this.slideTo(this.activeIndex);
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
    if (
      !this.prevBtnEl ||
      !this.nextBtnEl ||
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
  private sliderDragging(): void {
    const dragMove$ = this.mouseDown$.pipe(
      switchMap((startEvent) => {
        this.startDragging = true;
        this.handleNavigation(true);

        return this.mouseMove$.pipe(
          map((moveEvent) => {
            return {
              startEvent,
              moveEvent,
            };
          }),
          takeUntil(this.mouseUp$)
        );
      }),
      tap(({ startEvent, moveEvent }) => {
        this.draggedPath =
          this.translate + (startEvent.pageX - moveEvent.pageX);

        this.isDraggingSubject.next(true);

        console.log(moveEvent.pageX);

        if (
          this.draggedPath > this.trackWidth + (this.slideWidth + this.gap) ||
          this.draggedPath < (this.slideWidth + this.gap) * -1
        ) {
          return;
        }

        this.setTranslateX(this.draggedPath);
      }),
      takeUntil(this.ngUnsubscribe$)
    );
    dragMove$.subscribe();

    this.mouseUp$.subscribe(() => {
      if (!this.startDragging) return;

      console.log('mouseup');

      this.startDragging = false;
      this.isDraggingSubject.next(false);
      this.handleNavigation(false);

      this.activeIndex = Math.round(
        this.draggedPath / (this.slideWidth + this.gap)
      );

      this.handleSlideScroll();
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
    // if (this.isDragging) return;

    console.log('received index', index);

    this.lockNavigation();

    this.translate = Math.abs(this.scrollWidth * index);
    this.setTranslateX(this.translate);
  }

  // Slide styles
  private setTranslateX(path: number): void {
    this.translateX = `translateX(${path < 0 ? Math.abs(path) : '-' + path}px)`;
  }
}
