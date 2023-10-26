import { RouterOutlet } from '@angular/router';
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { AppComponent } from './app.component';

export default {
  title: 'AppComponent',
  component: AppComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterOutlet],
    }),
  ],
} as Meta<AppComponent>;

const Template = (): StoryFn => (args) => ({
  props: args,
});

export const Primary = Template();
Primary.args = {};
