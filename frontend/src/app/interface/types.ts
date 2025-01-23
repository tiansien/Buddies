export interface Menu {
  path?: string;
  title: string;
  icon?: string;
  open?: boolean;
  selected?: boolean;
  children?: Menu[];
  actionCode?: string;
  isNewLink?: boolean;
  adminOnly?: boolean;
  userOnly?: boolean;
}