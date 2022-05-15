import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { GridModule } from '../../grid.module';
import { AutoCompleteFilterComponent } from './auto-complete-filter.component';

export default {
  title: 'AutoCompleteFilterComponent',
  component: AutoCompleteFilterComponent,
  decorators: [
    moduleMetadata({
      imports: [GridModule, BrowserAnimationsModule, SharedUiModule],
    }),
  ],
  args: {
    header: 'Biology',
    values: [
      {
        id: '1',
        label: 'E. coli',
        selected: false,
      },
      {
        id: '2',
        label: 'H. sapiens',
        selected: true,
      },
      {
        id: '3',
        label: 'H. neanderthalensis',
        selected: true,
      },
    ],
  },
  argTypes: {
    autoCompleteFilterChange: {
      action: 'autoCompleteFilterChange',
    },
  },
} as Meta<AutoCompleteFilterComponent>;

const Template: Story<AutoCompleteFilterComponent> = (args: AutoCompleteFilterComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
