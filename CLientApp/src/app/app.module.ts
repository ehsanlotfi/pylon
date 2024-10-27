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
    "title": "Users",
    "icon": "bi bi-people",
    "link": "#",
    "children": [
      {
        "title": "Add User",
        "link": "/users/add"
      },
      {
        "title": "Manage Users",
        "link": "/users/manage"
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
        <nav class="app-navbar navbar navbar-expand-lg navbar-light bg-light">
          <a class="navbar-brand" href="#">Admin Panel</a>
        </nav>
        <div class="d-flex">
          <!-- Sidebar -->
          <div class="app-sidebar bg-light border-right">
            <ul class="nav flex-column">
              <li *ngFor="let item of menuItems" class="nav-item">
                <div class="nav-link" ngbDropdown>
                  <i class="{{ item.icon }}"></i> {{ item.title }}
                  <ng-container *ngIf="item.children.length > 0">
                    <span class="dropdown-toggle"></span>
                  </ng-container>
                </div>
                <ul *ngIf="item.children.length > 0" class="nav flex-column ml-3">
                  <li *ngFor="let child of item.children" class="nav-item">
                    <a class="nav-link" href="{{ child.link }}">{{ child.title }}</a>
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
    path: "home",
    component: _page.WSFormComponent
  },
  {
    path: "ws-list",
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
