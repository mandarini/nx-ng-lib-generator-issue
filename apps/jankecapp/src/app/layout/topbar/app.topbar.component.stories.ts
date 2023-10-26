import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { AppTopBarComponent } from './app.topbar.component';

export default {
  title: 'AppTopBarComponent',
  component: AppTopBarComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<AppTopBarComponent>;

const Template = (): StoryFn => (args) => ({
  props: args,
});

export const Primary = Template();
Primary.args = {};
