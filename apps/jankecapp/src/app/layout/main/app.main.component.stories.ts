import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { AppMainComponent } from './app.main.component';

export default {
  title: 'AppMainComponent',
  component: AppMainComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<AppMainComponent>;

const Template = (): StoryFn => (args) => ({
  props: args,
});

export const Primary = Template();
Primary.args = {};
