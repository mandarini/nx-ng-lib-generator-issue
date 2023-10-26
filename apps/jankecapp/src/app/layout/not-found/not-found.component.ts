import { Component } from '@angular/core';
import { SharedTranslateKeys } from '@fiyu/api';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'fiyu-not-found',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  sharedTranslateKeys = SharedTranslateKeys;
}
