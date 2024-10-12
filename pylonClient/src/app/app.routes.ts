import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
    },
    {
        path: "home",
        loadComponent: () => import('./pages/ws-form/web-service-form.component').then(mod => mod.WebServiceFormComponent)
    },
];
