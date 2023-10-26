import { Component } from '@angular/core';
import { SharedTranslateKeys } from '@fiyu/api';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'fiyu-not-authorized',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.scss'],
})
export class NotAuthorizedComponent {
  sharedTranslateKeys = SharedTranslateKeys;
}
