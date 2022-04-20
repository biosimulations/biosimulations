export class ControlColumn {
  public id!: string;

  public heading!: string;

  // Whether the attribute is visible in the controls panel
  public hidden?: boolean;

  // Whether the attribute should be shown by default
  public show?: boolean;

  // Whether the attribute is currently selected
  public _visible?: boolean;

  // Whether there should be a filter created for this attribute
  public filterable? = true;
}

export class ControlsState {
  public openControlPanelId: number = 1;
  public controlsOpen = true;
  public columns: ControlColumn[] = [];
}
