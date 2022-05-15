# Grid 

This library contains UI components for creating data-grids. A data-grid is composed of a collection of rows of arbitrary type and a defined set of columns. The columns are described with a list of column-definitions.

The components provide ui interfaces for selecting columns, filtering columns, and performing search over the data. 

## Components

## Controls
The controls component is the high-level component that maintains the state of all the filtering and search options. 

Each of the components below maintains its own state based on its input and by handling events. The state of each component is emitted as an event when it changes. The controls component responds to these events to update the total filter and search state.

### Date Filter
The date filter component is a control that allows the user to filter the data by a date range. The state of the component is the earliest and latest valid dates (or null) and the 
 ### String Filter
The string filter allows filtering the data to a list of specific strings. The state of the component is a list of objects that contain the string and a boolean indicating if the string is selected.
### Number Filter
The number filter allows filtering the data by a number range. The state of the component is the minimum and maximum valid numbers, the step size, and the minimum and maximum values that are currently selected.

### Auto Complete Filter

The auto complete filter allows filtering the data by a list of string. Unlike the string filter, the auto complete filter does not present a list of possible values to the user. Instead, the user is presented with a text field that autocompletes the list of possible values. 


### Select
The select component allows the user to select the columns of the data that will be displayed. The state of the component is a list of objects that contain the column id, column name, and a boolean indicating if the column is selected.

### Search

The search component is a simple search field that allows the user to search the data. The state of the component is the search string. 

## Future Components

-[ ] Service for maintaining the state of the filters and search

-[ ] Component for displaying the data as a table 

# Development
The components in the library are best developed using [Storybook](https://storybook.js.org). To run the Storybook for this library, run the following command:
 
 ```
 nx run grid:storybook
 ```
 To create a new story for a component, run the following command replacing the component information as needed 

 ``` 
 npx nx generate @nrwl/angular:component-story --componentFileName=controls.component --componentName=ControlsComponent --componentPath=src/lib/controls --projectPath=libs/grid

 ```
