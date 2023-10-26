import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { AppMenuComponent } from './app.menu.component';

export default {
  title: 'AppMenuComponent',
  component: AppMenuComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<AppMenuComponent>;

const Template = (): StoryFn => (args) => ({
  props: args,
});

export const Primary = Template();
Primary.args = {};
