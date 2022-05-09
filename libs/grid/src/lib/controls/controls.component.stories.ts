import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { GridModule } from '../grid.module';
import { GridControlsComponent } from './controls.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
export default {
  title: 'GridControlsComponent',
  component: GridControlsComponent,
  decorators: [
    moduleMetadata({
      imports: [GridModule, BrowserAnimationsModule],
    }),
  ],
} as Meta<GridControlsComponent>;

const Template: Story<GridControlsComponent> = (args: GridControlsComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  openControlPanelId: 1,
  attributesHeading: 'Columns',
  searchPlaceHolder: '',
  searchToolTip: '',
  closeable: false,
};
