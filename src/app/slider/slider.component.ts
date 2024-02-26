import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  Inject,
  Input,
  QueryList,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  get defaultWidth() {
    return this.sliderWidth / this.slidesPerView;
  }
  get widthWithGap() {
    return (
      (this.sliderWidth - this.gap * (this.slidesPerView - 1)) /
      this.slidesPerView
    );
  }

  // Index
  private activeIndex: number = 0;
  get maxIndex() {
    return this.slides.length - this.slidesPerView;
  }

  // Translate
  private translate: number = 0;
  private translateSubject = new BehaviorSubject<string>('');
  translate$ = this.translateSubject.asObservable();

  // Drag
  private isDraggingSubject = new BehaviorSubject<boolean>(false);
  isDragging$ = this.isDraggingSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private startDragging: boolean = false;
  private draggedPath: number = 0;

  // Event listeners
  private resize$ = fromEvent(window, 'resize').pipe(
    takeUntil(this.ngUnsubscribe$)
  );
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
  private touchStart$ = fromEvent<TouchEvent>(
    this.el.nativeElement,
    'touchstart'
  ).pipe(takeUntil(this.ngUnsubscribe$));
  private touchMove$ = fromEvent<TouchEvent>(this.document, 'touchmove').pipe(
    takeUntil(this.ngUnsubscribe$)
  );
  private touchEnd$ = fromEvent<TouchEvent>(this.document, 'touchend').pipe(
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
    this.onMouseEvents();
    this.onTouchEvents();
  }

  // On resize
  private onResize(): void {
    this.resize$.pipe(debounceTime(500)).subscribe((e) => {
      this.updateWidth();
      this.handleSlideScroll();
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
  private onMouseEvents(): void {
    this.mouseDown$
      .pipe(
        switchMap((mouseDown) => {
          this.dragStart();

          return this.mouseMove$.pipe(
            map((mouseMove) => {
              return {
                mouseDown,
                mouseMove,
              };
            }),
            takeUntil(this.mouseUp$)
          );
        }),
        tap(({ mouseDown, mouseMove }) => {
          this.dragMove(mouseDown.pageX, mouseMove.pageX);
        }),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe();

    this.mouseUp$.subscribe(() => {
      this.dragEnd();
    });
  }

  private onTouchEvents(): void {
    this.touchStart$
      .pipe(
        switchMap((touchStart) => {
          this.dragStart();

          return this.touchMove$.pipe(
            map((touchMove) => {
              return {
                touchStart,
                touchMove,
              };
            }),
            takeUntil(this.touchEnd$)
          );
        }),
        tap(({ touchStart, touchMove }) => {
          this.dragMove(
            touchStart.touches[0].clientX,
            touchMove.touches[0].clientX
          );
        }),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe();

    this.touchEnd$.subscribe(() => {
      this.dragEnd();
    });
  }

  private dragStart(): void {
    this.startDragging = true;
    this.handleNavigation(true);
  }

  private dragMove(start: number, move: number): void {
    this.draggedPath = this.translate + (start - move);

    this.isDraggingSubject.next(true);

    if (
      this.draggedPath > this.trackWidth + (this.slideWidth + this.gap) ||
      this.draggedPath < (this.slideWidth + this.gap) * -1
    ) {
      return;
    }

    this.setTranslate(this.draggedPath);
  }

  private dragEnd(): void {
    if (!this.startDragging) return;

    this.startDragging = false;

    this.isDraggingSubject.next(false);
    this.handleNavigation(false);

    this.activeIndex = Math.round(
      this.draggedPath / (this.slideWidth + this.gap)
    );

    this.handleSlideScroll();
  }

  // Update values
  private updateWidth(): void {
    this.lockNavigation();

    this.slideWidth =
      this.gap > 0 && this.slidesPerView > 1
        ? this.widthWithGap
        : this.defaultWidth;

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
    this.lockNavigation();

    this.translate = Math.abs(this.scrollWidth * index);
    this.setTranslate(this.translate);
  }

  // Translate
  private setTranslate(path: number): void {
    this.translateSubject.next(
      `translateX(${path < 0 ? Math.abs(path) : '-' + path}px)`
    );
  }
}
