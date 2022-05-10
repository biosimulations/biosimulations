import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ControlColumn } from '../controls';
import { SelectComponent } from './select.component';

export default {
  title: 'SelectComponent',
  component: SelectComponent,
  argTypes: {
    opened: {
      action: 'opened',
    },
    columnsChange: {
      action: 'columnsChange',
    },
  },
  args: {
    columns: [
      { id: 'default', heading: 'Default', hidden: false, show: true },
      { id: 'hidden', heading: 'Hidden', hidden: true, show: true },
      { id: 'unselected', heading: 'Unselected', hidden: false, show: false },
      { id: 'test3', heading: 'Test3', hidden: false, show: true },
      { id: 'test4', heading: 'Test4', hidden: false, show: true },
    ] as ControlColumn[],
    expanded: false,
    disabled: false,
    heading: 'Columns',
  },

  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        MatListModule,
        BiosimulationsIconsModule,
        MatExpansionModule,
        MatCheckboxModule,
      ],
    }),
  ],
  template: `<storybook-page>
    <mat-accordion>
    
    <biosimulations-select #selector></biosimulations-select>
    {{selector.columns | json}}
 
    </mat-accordion>
  </storybook-page>`,
} as Meta<SelectComponent>;

const Template: Story<SelectComponent> = (args: SelectComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
