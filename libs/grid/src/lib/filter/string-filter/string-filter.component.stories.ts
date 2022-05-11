import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { GridModule } from '../../grid.module';
import { StringFilterComponent } from './string-filter.component';

export default {
  title: 'StringFilterComponent',
  component: StringFilterComponent,
  decorators: [
    moduleMetadata({
      imports: [GridModule, BrowserAnimationsModule, SharedUiModule],
    }),
  ],
  argTypes: {
    stringFilterChange: {
      action: 'stringFilterChange',
    },
  },
  args: {
    header: 'Biology',
    values: [
      {
        id: '1',
        label: 'First One',
        selected: false,
        showTooltip: false,
      },
      {
        id: '2',
        label: 'Second One',
        selected: true,
        showTooltip: true,
      },
    ],
  },
} as Meta<StringFilterComponent>;

const Template: Story<StringFilterComponent> = (args: StringFilterComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
