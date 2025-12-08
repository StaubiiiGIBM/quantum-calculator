import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'camera',
        loadComponent: () =>
          import('../camera/camera.page').then((m) => m.CameraPage),
      },
      {
        path: 'calculator',
        loadComponent: () =>
          import('../calculator/calculator.page').then((m) => m.CalculatorPage),
      },
      {
        path: 'processing',
        loadComponent: () =>
          import('../processing/processing.page').then((m) => m.ProcessingPage),
      },
      {
        path: 'result',
        loadComponent: () =>
          import('../result/result.page').then((m) => m.ResultPage),
      },
      {
        path: '',
        redirectTo: '/tabs/camera',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/camera',
    pathMatch: 'full',
  },
];
