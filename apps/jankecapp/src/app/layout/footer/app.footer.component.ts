import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './app.footer.component.html',
  standalone: true,
  imports: [NgOptimizedImage],
})
export class AppFooterComponent {
  public currentYear = new Date().getFullYear();
}
