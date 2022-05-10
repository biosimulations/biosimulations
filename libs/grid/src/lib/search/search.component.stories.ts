import { OverlayModule } from '@angular/cdk/overlay';
import { GridModule } from '@angular/flex-layout/grid';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { SearchComponent } from './search.component';

export default {
  title: 'SearchComponent',
  component: SearchComponent,
  argTypes: {
    searchQueryUpdated: {
      action: 'searchQueryUpdated',
    },
    opened: {
      action: 'opened',
    },
  },
  args: {
    searchPlaceHolder: 'placeholder...',
    searchToolTip: '',
    searchQuery: '',
    expanded: false,
    disabled: false,
  },
  decorators: [
    moduleMetadata({
      imports: [
        GridModule,
        BiosimulationsIconsModule,
        SharedUiModule,
        MatExpansionModule,
        BrowserAnimationsModule,
        OverlayModule,
        MatFormFieldModule,
      ],
    }),
  ],
  template: `<storybook-page>
    <mat-accordion>
    
    <biosimulations-search></biosimulations-search>
 
    </mat-accordion>
  </storybook-page>`,
} as Meta<SearchComponent>;

const Template: Story<SearchComponent> = (args: SearchComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
