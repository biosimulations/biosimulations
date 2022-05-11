import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { GridModule } from '../../grid.module';
import { DateFilterComponent } from './date-filter.component';

export default {
  title: 'DateFilterComponent',
  component: DateFilterComponent,
  decorators: [
    moduleMetadata({
      imports: [GridModule, BrowserAnimationsModule, MatDatepickerModule],
    }),
  ],
  args: {
    startDate: null,
    endDate: null,
    selectedStartDate: null,
    selectedEndDate: null,
    disabled: false,
    expanded: false,
  },
  argTypes: {
    dateFilterChange: {
      action: 'dateFilterChange',
    },
  },
} as Meta<DateFilterComponent>;

const Template: Story<DateFilterComponent> = (args: DateFilterComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
