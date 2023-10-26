import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { AppLoginComponent } from './app.login.component';

export default {
  title: 'AppLoginComponent',
  component: AppLoginComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<AppLoginComponent>;

const Template = (): StoryFn => (args) => ({
  props: args,
});

export const Primary = Template();
Primary.args = {};
