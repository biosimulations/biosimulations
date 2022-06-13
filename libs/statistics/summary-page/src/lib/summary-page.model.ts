import { BiosimulationsIcon } from '@biosimulations/shared/icons';

import { Observable } from 'rxjs';

export type StatsChart = {
  type: StatsChartType;
  title: string;
  label: string;
  labels: string[];
  values: number[];
  yAxis?: 'linear' | 'logarithmic';
  yLabelRotation?: number;
};

export type StatItem = {
  heading: string;
  hidden?: boolean;
  subheading: string;
  icon: BiosimulationsIcon;
  chart: StatsChart;
};
export type StatItemGroup = {
  heading: string;
  items: StatItem[];
};
export enum StatsChartType {
  'counter', // A single value that represents an attribute of the statsentity that is a count, total, sum, or other quantity
  'histogram', //
  'pie', //
  'distribution', // A counter that has various values over a range
}
export type StatsChartSection = {
  headingStart: string;
  headingEnd: string;
  statItems$: Observable<StatItem[]>;
};
