import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { AppMenuitemComponent } from './app.menuitem.component';

export default {
  title: 'AppMenuitemComponent',
  component: AppMenuitemComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<AppMenuitemComponent>;

const Template = (): StoryFn => (args) => ({
  props: args,
});

export const Primary = Template();
Primary.args = {
  index: 0,
  root: false,
  parentKey: '',
};
