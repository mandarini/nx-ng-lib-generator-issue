import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { AppFooterComponent } from './app.footer.component';

export default {
  title: 'AppFooterComponent',
  component: AppFooterComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<AppFooterComponent>;

const Template = (): StoryFn => (args) => ({
  props: args,
});

export const Primary = Template();
Primary.args = {};
