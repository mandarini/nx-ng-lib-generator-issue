import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { CodeHighlighterDirective } from './codeHighlighter';

@Component({
  selector: 'fiyu-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss'],
  standalone: true,
  imports: [NgOptimizedImage, CodeHighlighterDirective],
})
export class DocumentationComponent {}
