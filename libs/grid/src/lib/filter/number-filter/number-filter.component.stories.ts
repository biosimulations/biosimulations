import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { GridModule } from '../../grid.module';
import { NumberFilterComponent } from './number-filter.component';

export default {
  title: 'NumberFilterComponent',
  component: NumberFilterComponent,
  decorators: [
    moduleMetadata({
      imports: [GridModule, BrowserAnimationsModule, SharedUiModule],
    }),
  ],
  args: {
    range: {
      min: 0,
      max: 30,
      step: 1,
      minSelected: 1,
      maxSelected: 99,
    },
  },
  argTypes: {
    numberFilterChange: {
      action: 'numberFilterChange',
    },
  },
} as Meta<NumberFilterComponent>;

const Template: Story<NumberFilterComponent> = (args: NumberFilterComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
