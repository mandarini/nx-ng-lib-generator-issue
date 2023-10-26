import { AfterViewInit, Directive, ElementRef, HostBinding, inject } from '@angular/core';
import { WINDOW } from '@fiyu/api';

@Directive({
  selector: '[fiyuPCode]',
  standalone: true,
})
export class CodeHighlighterDirective implements AfterViewInit {
  public el: ElementRef = inject(ElementRef);
  private readonly window: Window = inject(WINDOW);

  @HostBinding('p-element')
  ngAfterViewInit() {
    if ((<any>this.window)['Prism']) {
      (<any>this.window)['Prism'].highlightElement(this.el.nativeElement);
    }
  }
}
