import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { ResetPasswordFormComponent } from './reset-password-form.component';

export default {
  title: 'ResetPasswordFormComponent',
  component: ResetPasswordFormComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ResetPasswordFormComponent>;

const Template = (): StoryFn => (args) => ({
  props: args,
});

export const Primary = Template();
Primary.args = {};
