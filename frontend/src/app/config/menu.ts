import { Menu } from '../interface/types';
import { InjectionToken } from '@angular/core';
import { ActionCode } from './actionCode';

export const MENU_TOKEN = new InjectionToken<Menu[]>('menu-token', {
  providedIn: 'root',
  factory(): Menu[] {
    return menuNav;
  },
});

const menuNav: Menu[] = [
  {
    title: 'Event',
    icon: 'calendar',
    open: false,
    selected: false,
    path: 'events',
    actionCode: ActionCode.UserManage,
    children: [
      {
        title: 'Event',
        selected: false,
        actionCode: ActionCode.UserManage,
        path: 'events',
      },
      {
        title: 'Add Event',
        selected: false,
        actionCode: ActionCode.UserManage,
        path: 'events/create',
        adminOnly: true,
      },
      {
        title: 'Requests',
        selected: false,
        actionCode: ActionCode.UserManage,
        path: 'events/managementEvent',
        adminOnly: true,
      },
    ],
  },
  {
    title: 'Buddy',
    icon: 'reddit',
    open: false,
    selected: false,
    path: 'buddy',
    actionCode: ActionCode.UserManage,
    userOnly: true,
  },
  {
    title: 'Blog',
    icon: 'book',
    open: false,
    selected: false,
    path: 'blog',
    actionCode: ActionCode.UserManage,
    children: [
      {
        title: 'Blog',
        selected: false,
        actionCode: ActionCode.UserManage,
        path: 'blog',
      },
      {
        title: 'Add Blog',
        selected: false,
        actionCode: ActionCode.UserManage,
        path: 'blog/add',
      },
    ],
  },
  // {
  //   title: 'Admin Dashboard',
  //   icon: 'dashboard',
  //   open: false,
  //   selected: false,
  //   path: 'admin',
  //   actionCode: ActionCode.UserManage,
  //   adminOnly: true, // New admin-only section
  // },
  {
    title: 'Message',
    icon: 'message',
    open: false,
    selected: false,
    path: 'message',
    actionCode: ActionCode.UserManage,
  },
];
