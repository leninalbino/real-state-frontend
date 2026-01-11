export interface PickerNode {
  id: string;
  label: string;
  children?: PickerNode[];
  meta?: unknown;
}

export interface MultiColumnPickerProps {
  label: string;
  placeholder: string;
  data: PickerNode[];
  valueIds: string[];
  onChange: (pathNodes: PickerNode[], valueIds: string[]) => void;
  closeOnLeafSelect?: boolean;
  initialVisibleItems?: number;
  renderValue?: (pathNodes: PickerNode[]) => string;
}
