import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { WorkspaceComponent } from './workspace.component';

export default {
  title: 'WorkspaceComponent',
  component: WorkspaceComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<WorkspaceComponent>;

const Template = (): StoryFn => (args) => ({
  props: args,
});

export const Primary = Template();
Primary.args = {};
