import {Directive, ElementRef, Input, HostListener, AfterViewInit, OnChanges} from '@angular/core';

@Directive({
  selector: '[ngFitText]'
})
export class NgFitTextDirective implements AfterViewInit, OnChanges {

  element: ElementRef;

  parent: any;
  domElem: any;
  domElemStyle: any;
  computed: any;
  newlines: any;
  loadDelay: any;
  compressor: any;
  min: any;
  max: any;
  minFontSize: any;
  maxFontSize: any;
  lineHeight: any;
  display: any;
  calcSize: any;
  timer: any;

  // attributes
  @Input() fittextLoadDelay: any;
  @Input() fittext: any;
  @Input() fittextMin: any;
  @Input() fittextMax: any;


  constructor(element: ElementRef) {
    this.element = element;
  }

  ngAfterViewInit(){
    const config = {
      'debounce'    : false,
      'delay'       : 250,
      'loadDelay'   : 10,
      'compressor'  : 1,
      'min'         : 0,
      'max'         : Number.POSITIVE_INFINITY
    };

    this.parent          = this.element.nativeElement.parentNode;
    this.domElem         = this.element.nativeElement;
    this.domElemStyle    = this.element.nativeElement.style;
    this.computed        = window.getComputedStyle(this.domElem, null);
    this.newlines        = this.element.nativeElement.children.length || 1;

    // attributes init
    this.loadDelay       = this.fittextLoadDelay || config.loadDelay;
    this.compressor      = isNaN(this.fittext) ? config.compressor : this.fittext;
    this.min             = this.fittextMin || config.min;
    this.max             = this.fittextMax || config.max;
    this.minFontSize     = this.min ==='inherit'? this.computed['font-size'] : this.min;
    this.maxFontSize     = this.max ==='inherit'? this.computed['font-size'] : this.max;
    this.lineHeight      = this.computed['line-height'];
    this.display         = this.computed['display'];
    this.calcSize        = 10;

    let timer = window.setInterval( () => {
      this.resizer();
      window.clearInterval(timer);
    }, this.loadDelay);

    this.resizer();
  }

  calculate(): number {
    var ratio = (this.calcSize * this.newlines) / this.domElem.offsetWidth / this.newlines;

    return Math.max(
      Math.min((this.parent.offsetWidth - 6) * ratio * this.compressor,
        parseFloat(this.maxFontSize)
      ),
      parseFloat(this.minFontSize)
    )
  }

  ngOnChanges(){
    this.resizer();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizer();
  }

  resizer() {

    // Don't calculate for elements with no width or height
    if (this.domElem.offsetHeight * this.domElem.offsetWidth === 0)
      return;

    // Set standard values for calculation
    this.domElemStyle.fontSize       = this.calcSize + 'px';
    this.domElemStyle.lineHeight     = '1';
    this.domElemStyle.display        = 'inline-block';

    // Set usage values
    this.domElemStyle.fontSize       = this.calculate() + 'px';
    this.domElemStyle.lineHeight     = this.lineHeight;
    this.domElemStyle.display        = this.display;
  }

}
