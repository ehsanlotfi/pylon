import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
    },
    {
        path: "home",
        loadComponent: () => import('./pages/ws-form/ws-form.component').then(mod => mod.WSFormComponent)
    },
    {
        path: "ws-list",
        loadComponent: () => import('./pages/ws-list/ws-list.component').then(mod => mod.WSListComponent)
    },
];
