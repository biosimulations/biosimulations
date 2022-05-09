import { animate, style, AnimationBuilder } from '@angular/animations';
import { ListKeyManager } from '@angular/cdk/a11y';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Output,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { interval, BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { MatCarousel, Orientation, SvgIconOverrides } from './carousel';
import { MatCarouselSlideComponent } from './carousel-slide/carousel-slide.component';

enum Direction {
  left,
  right,
  index,
}

@Component({
  selector: 'mat-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class MatCarouselComponent implements AfterContentInit, AfterViewInit, MatCarousel, OnDestroy {
  @Input() public timings = '250ms ease-in';
  @Input() public lazyLoad = false;
  @Input() public svgIconOverrides!: SvgIconOverrides;

  @Input()
  public set autoplay(value: boolean) {
    this.autoplay$.next(value);
    this._autoplay = value;
  }

  @Input()
  public set interval(value: number) {
    this.interval$.next(value);
  }

  public get loop(): boolean {
    return this._loop;
  }
  @Input()
  public set loop(value: boolean) {
    this.loop$.next(value);
    this._loop = value;
  }

  @Input() public hideArrows = true;
  @Input() public hideIndicators = true;
  @Input() public ariaLabel = 'Sliding carousel';
  @Input() public color: ThemePalette = 'accent';

  public get maxWidth(): string {
    return this._maxWidth;
  }
  @Input()
  public set maxWidth(value: string) {
    this._maxWidth = value;
    this.maxWidth$.next(1);
  }

  @Input() public maintainAspectRatio = true;
  @Input() public proportion = 25;
  @Input() public slideHeight = '100%';

  @Input()
  public set slides(value: number) {
    this.slides$.next(value);
  }

  @Input() public useKeyboard = false;
  @Input() public useMouseWheel = false;

  public get orientation(): Orientation {
    return this._orientation;
  }
  @Input()
  public set orientation(value: Orientation) {
    this.orientation$.next(value);
    this._orientation = value;
  }

  @Output()
  public changeEmitter: EventEmitter<number> = new EventEmitter<number>();

  public get currentIndex(): number {
    if (this.listKeyManager && this.listKeyManager.activeItemIndex) {
      return this.listKeyManager.activeItemIndex;
    }

    return 0;
  }
  public get currentSlide(): MatCarouselSlideComponent | null {
    if (this.listKeyManager) {
      return this.listKeyManager.activeItem;
    }

    return null;
  }

  @ContentChildren(MatCarouselSlideComponent)
  public slidesList!: QueryList<MatCarouselSlideComponent>;
  @ViewChild('carouselContainer')
  private carouselContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('carouselList') private carouselList!: ElementRef<HTMLElement>;
  public listKeyManager!: ListKeyManager<MatCarouselSlideComponent>;

  private _autoplay = true;
  private autoplay$ = new Subject<boolean>();

  private interval$ = new BehaviorSubject<number>(5000);
  private slides$ = new BehaviorSubject<number | null>(null);

  private _maxWidth = 'auto';
  private maxWidth$ = new Subject<any>();

  private _loop = true;
  private loop$ = new Subject<boolean>();

  private _orientation: Orientation = 'ltr';
  private orientation$ = new Subject<Orientation>();

  private timer$!: Observable<number>;
  private timerStop$ = new Subject<any>();

  private destroy$ = new Subject<any>();
  private playing = false;

  private width!: number;

  constructor(
    private animationBuilder: AnimationBuilder,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {}

  @HostListener('keyup', ['$event'])
  public onKeyUp(event: KeyboardEvent): void {
    if (this.useKeyboard && !this.playing) {
      this.listKeyManager.onKeydown(event);
    }
  }

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    this.stopTimer();
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    this.startTimer(this._autoplay);
  }

  @HostListener('mousewheel', ['$event'])
  public onMouseWheel(event: WheelEvent): void {
    if (this.useMouseWheel) {
      event.preventDefault(); // prevent window to scroll
      const deltaY = Math.sign(event.deltaY);

      if (deltaY > 0) {
        this.next();
      } else if (deltaY < 0) {
        this.previous();
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event): void {
    // Reset carousel when width is resized
    // in order to avoid major glitches.
    const w = this.getWidth();
    if (w !== this.width) {
      this.width = w;
      this.slideTo(0);
    }
  }

  public ngAfterContentInit(): void {
    if (!this.lazyLoad) {
      this.slidesList.forEach((slide) => (slide.load = true));
    } else {
      this.slidesList.first.load = true;
      setTimeout(() => {
        (this.slidesList.find((s, i) => i === 1 % this.slidesList.length) as MatCarouselSlideComponent).load = true;
        (
          this.slidesList.find(
            (s, i) => i === (this.slidesList.length - 1) % this.slidesList.length,
          ) as MatCarouselSlideComponent
        ).load = true;
      }, this.interval$.getValue() / 2);
    }

    this.listKeyManager = new ListKeyManager(this.slidesList)
      .withVerticalOrientation(false)
      .withHorizontalOrientation(this._orientation)
      .withWrap(this._loop);

    this.listKeyManager.updateActiveItem(0);

    this.listKeyManager.change.pipe(takeUntil(this.destroy$)).subscribe(() => this.playAnimation());
  }

  public ngAfterViewInit(): void {
    this.width = this.getWidth();

    this.autoplay$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.stopTimer();
      this.startTimer(value);
    });

    this.interval$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.stopTimer();
      this.resetTimer(value);
      this.startTimer(this._autoplay);
    });

    this.maxWidth$.pipe(takeUntil(this.destroy$)).subscribe(() => this.slideTo(0));

    this.loop$.pipe(takeUntil(this.destroy$)).subscribe((value) => this.listKeyManager.withWrap(value));

    this.orientation$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => this.listKeyManager.withHorizontalOrientation(value));

    this.slides$
      .pipe(
        takeUntil(this.destroy$),
        filter((value) => {
          return !!value && value < this.slidesList.length;
        }),
      )
      .subscribe((value) => this.resetSlides(value as number));
  }

  public ngOnDestroy(): void {
    this.destroy$.next(1);
    this.destroy$.complete();
  }

  public next(): void {
    this.goto(Direction.right);
  }

  public previous(): void {
    this.goto(Direction.left);
  }

  public slideTo(index: number): void {
    this.goto(Direction.index, index);
  }

  public onPan(event: any, slideElem: HTMLElement): void {
    // https://github.com/angular/angular/issues/10541#issuecomment-346539242
    // if y velocity is greater, it's a panup/pandown, so ignore.
    if (Math.abs(event.velocityY) > Math.abs(event.velocityX)) {
      return;
    }
    let deltaX = event.deltaX;
    if (this.isOutOfBounds()) {
      deltaX *= 0.2; // decelerate movement;
    }

    this.renderer.setStyle(slideElem, 'cursor', 'grabbing');
    this.renderer.setStyle(
      this.carouselList.nativeElement,
      'transform',
      this.getTranslation(this.getOffset() + deltaX),
    );
  }

  public onPanEnd(event: any, slideElem: HTMLElement): void {
    this.renderer.removeStyle(slideElem, 'cursor');

    if (!this.isOutOfBounds() && Math.abs(event.deltaX) > this.getWidth() * 0.25) {
      if (event.deltaX <= 0) {
        this.next();
        return;
      }
      this.previous();
      return;
    }
    this.playAnimation(); // slide back, don't change current index
  }

  private isOutOfBounds(): boolean {
    const sign = this.orientation === 'rtl' ? -1 : 1;
    const left =
      sign *
      (this.carouselList.nativeElement.getBoundingClientRect().left -
        (this.carouselList.nativeElement?.offsetParent?.getBoundingClientRect().left || 0));
    const lastIndex = this.slidesList.length - 1;
    const width = -this.getWidth() * lastIndex;

    return (
      (this.listKeyManager.activeItemIndex === 0 && left >= 0) ||
      (this.listKeyManager.activeItemIndex === lastIndex && left <= width)
    );
  }

  private isVisible(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const elem = this.carouselContainer.nativeElement;
    const docViewTop = window.pageYOffset;
    const docViewBottom = docViewTop + window.innerHeight;
    const elemOffset = elem.getBoundingClientRect();
    const elemTop = docViewTop + elemOffset.top;
    const elemBottom = elemTop + elemOffset.height;

    return elemBottom <= docViewBottom || elemTop >= docViewTop;
  }

  private getOffset(): number {
    const offset = (this.listKeyManager.activeItemIndex as number) * this.getWidth();

    const sign = this.orientation === 'rtl' ? 1 : -1;
    return sign * offset;
  }

  private getTranslation(offset: number): string {
    return `translateX(${offset}px)`;
  }

  private getWidth(): number {
    return this.carouselContainer.nativeElement.clientWidth;
  }

  private goto(direction: Direction, index?: number): void {
    if (!this.playing) {
      const rtl = this.orientation === 'rtl';

      switch (direction) {
        case Direction.left:
          return rtl ? this.listKeyManager.setNextItemActive() : this.listKeyManager.setPreviousItemActive();
        case Direction.right:
          return rtl ? this.listKeyManager.setPreviousItemActive() : this.listKeyManager.setNextItemActive();
        case Direction.index:
          if (index !== undefined) {
            return this.listKeyManager.setActiveItem(index);
          }
      }
    }
  }

  private playAnimation(): void {
    const translation = this.getTranslation(this.getOffset());
    const factory = this.animationBuilder.build(animate(this.timings, style({ transform: translation })));
    const animation = factory.create(this.carouselList.nativeElement);

    animation.onStart(() => {
      this.playing = true;
    });
    animation.onDone(() => {
      this.changeEmitter.emit(this.currentIndex);
      this.playing = false;
      if (this.lazyLoad) {
        (
          this.slidesList.find(
            (s, i) => i === (this.currentIndex + 1) % this.slidesList.length,
          ) as MatCarouselSlideComponent
        ).load = true;
        (
          this.slidesList.find(
            (s, i) => i === (this.currentIndex - 1 + this.slidesList.length) % this.slidesList.length,
          ) as MatCarouselSlideComponent
        ).load = true;
        (this.slidesList.find((s, i) => i === this.currentIndex) as MatCarouselSlideComponent).load = true;
      }
      this.renderer.setStyle(this.carouselList.nativeElement, 'transform', translation);
      animation.destroy();
    });
    animation.play();
  }

  private resetSlides(slides: number): void {
    this.slidesList.reset(this.slidesList.toArray().slice(0, slides));
  }

  private resetTimer(value: number): void {
    this.timer$ = interval(value);
  }

  private startTimer(autoplay: boolean): void {
    if (!autoplay) {
      return;
    }

    this.timer$
      .pipe(
        takeUntil(this.timerStop$),
        takeUntil(this.destroy$),
        filter(() => this.isVisible()),
      )
      .subscribe(() => {
        this.listKeyManager.withWrap(true).setNextItemActive();
        this.listKeyManager.withWrap(this.loop);
      });
  }

  private stopTimer(): void {
    this.timerStop$.next(1);
  }
}
