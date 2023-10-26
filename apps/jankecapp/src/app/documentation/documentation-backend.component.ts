import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { CodeHighlighterDirective } from './codeHighlighter';

@Component({
  selector: 'fiyu-backend-documentation',
  templateUrl: './documentation-backend.component.html',
  styleUrls: ['./documentation-backend.component.scss'],
  standalone: true,
  imports: [NgOptimizedImage, CodeHighlighterDirective],
})
export class DocumentationBackendComponent {}
