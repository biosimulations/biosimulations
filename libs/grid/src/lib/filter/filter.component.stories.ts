import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ControlColumn } from '../controls';
import { GridModule } from '../grid.module';
import { FilterComponent } from './filter.component';
import { columns } from './filter.component.fixtures';
export default {
  title: 'FilterComponent',
  component: FilterComponent,
  decorators: [
    moduleMetadata({
      imports: [GridModule, BrowserAnimationsModule],
    }),
  ],
  args: {
    columns,
    expanded: true,
    disabled: false,
    heading: 'Filters',
  },
  argTypes: {
    columnsChanged: { action: 'columnsChanged' },
    opened: { action: 'opened' },
    expanded: { action: 'expanded' },
    disabled: { action: 'disabled' },
  },
} as Meta<FilterComponent>;

const Template: Story<FilterComponent> = (args: FilterComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  expanded: true,
  disabled: false,
  heading: 'Filters',
  columns: columns as ControlColumn[],
};
