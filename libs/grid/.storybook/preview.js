// File: .storybook/preview.js

import withEvents from 'storybook-auto-events';
import { componentWrapperDecorator } from '@storybook/angular';

export const decorators = [withEvents, componentWrapperDecorator((story) => `<div style="margin: 3em">${story}</div>`)];
