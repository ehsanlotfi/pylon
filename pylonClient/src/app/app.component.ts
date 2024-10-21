import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

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
  standalone: true,
  imports: [RouterOutlet, NgbDropdownModule, CommonModule],
  templateUrl: './app.component.html'
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
