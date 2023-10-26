import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { ForgotPasswordFormComponent } from './forgot-password-form.component';

export default {
  title: 'ForgotPasswordFormComponent',
  component: ForgotPasswordFormComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ForgotPasswordFormComponent>;

const Template = (): StoryFn => (args) => ({
  props: args,
});

export const Primary = Template();
Primary.args = {};
