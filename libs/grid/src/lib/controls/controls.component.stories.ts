import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { GridModule } from '../grid.module';
import { GridControlsComponent } from './controls.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { columns } from './controls.component.fixtures';
import { Column } from '../columns';
export default {
  title: 'GridControlsComponent',
  component: GridControlsComponent,
  argTypes: {
    controlsStateUpdated: {
      action: 'controlstate',
    },
  },
  args: {
    openControlPanelId: 1,
    attributesHeading: 'Columns',
    searchPlaceHolder: 'placeholder...',
    searchToolTip: '',
    closeable: false,
  },

  template: `<storybook-page>
    <biosimulations-grid-controls ></biosimulations-grid-controls>
  </storybook-page>`,
  decorators: [
    moduleMetadata({
      imports: [GridModule, BrowserAnimationsModule],
    }),
  ],
} as Meta<GridControlsComponent>;

const Template: Story<GridControlsComponent> = (args: GridControlsComponent, events) => ({
  props: args,
  data: () => ({
    events,
  }),
});

export const Primary = Template.bind({});

export const WithColumns = Primary.bind({});
WithColumns.args = {
  ...Primary.args,
  columns: columns as Column[],
};
