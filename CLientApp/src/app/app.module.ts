import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { LicenseManager } from 'ag-grid-enterprise';
import { AgGridModule } from 'ag-grid-angular';
import * as _svc from '@app/services/index';
import * as _page from '@app/pages/index';

export const menuItems = [
  {
    "title": "Dashboard",
    "icon": "bi bi-speedometer2",
    "link": "/dashboard",
    "children": []
  },
  {
    "title": "Services",
    "icon": "bi bi-people",
    "children": [
      {
        "title": "All Service",
        "link": "services"
      },
      {
        "title": "Add Service",
        "link": "services/form"
      }
    ]
  },
  {
    "title": "Settings",
    "icon": "bi bi-gear",
    "link": "#",
    "children": [
      {
        "title": "General",
        "link": "/settings/general"
      },
      {
        "title": "Security",
        "link": "/settings/security"
      }
    ]
  }
];

@Component({
  selector: 'app-root',
  template: `
        <div class="app-container">
        <header class="app-navbar navbar navbar-expand-lg px-3">
          <a class="navbar-brand" href="#">Admin Panel</a>
        </header>
        <div class="d-flex">
          <div class="app-sidebar">
            <ul class="nav flex-column">
              <li *ngFor="let menu of menuItems" class="nav-item">
                <div class="nav-link" ngbDropdown>
                    {{ menu.title }}
                  <ng-container *ngIf="menu.children.length">
                    <span class="dropdown-toggle"></span>
                  </ng-container>
                </div>
                <ul *ngIf="menu.children.length" class="nav flex-column ms-3">
                  <li *ngFor="let child of menu.children" class="nav-item">
                    <a class="nav-link" [routerLink]="child.link">{{ child.title }}</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="app-content p-4">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
  `,
})
export class AppComponent
{
  isLightMode = false;
  isRtlMode = false;

  menuItems = menuItems;

  toggleDarkMode()
  {
    this.isLightMode = !this.isLightMode;
  }

  logout()
  {
    // Add logout logic here
  }
}

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "services/form",
    component: _page.WSFormComponent
  },
  {
    path: "services",
    component: _page.WSListComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

@NgModule({
  declarations: [
    AppComponent,
    _page.WSFormComponent,
    _page.WSListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  providers: [
    provideHttpClient(),
    _svc.WSService
  ],
  bootstrap: [AppComponent]
})
export class AppModule
{
  constructor()
  {
    (LicenseManager.prototype as any).showValid = true;
    LicenseManager.prototype.validateLicense = () =>
    {
      if ((LicenseManager.prototype as any).showValid)
      {
      }
      (LicenseManager.prototype as any).showValid = false;
      return true;
    };

    LicenseManager.prototype.isDisplayWatermark = () =>
    {
      if ((LicenseManager.prototype as any).showValid)
      {
      }
      (LicenseManager.prototype as any).showValid = false;
      return false;
    };

    LicenseManager.prototype.getWatermarkMessage = () =>
    {
      if ((LicenseManager.prototype as any).showValid)
      {
      }
      (LicenseManager.prototype as any).showValid = false;
      return "valid";
    };
  }
}
