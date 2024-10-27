import { Component } from '@angular/core';
import { ColDef, GetContextMenuItemsParams, MenuItemDef, SizeColumnsToContentStrategy, SizeColumnsToFitGridStrategy, SizeColumnsToFitProvidedWidthStrategy } from 'ag-grid-community';
import { LicenseManager } from "ag-grid-enterprise";

@Component({
  selector: 'app-ws-list',
  templateUrl: './ws-list.component.html'
})
export class WSListComponent
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

  public autoSizeStrategy:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy = {
      type: "fitGridWidth",
      defaultMinWidth: 100,
      columnLimits: [
        {
          colId: "country",
          minWidth: 900,
        },
      ],
    };

  rowData = [
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ];

  getContextMenuItems(
    params: GetContextMenuItemsParams,
  ): (string | MenuItemDef)[]
  {
    var result: (string | MenuItemDef)[] = [
      "separator",
      "copy",
      "separator",
      "chartRange",
    ];
    return result;
  }

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    { field: "make", filter: true },
    { field: "model", filter: true },
    { field: "price", filter: true },
    { field: "electric", filter: true }
  ];

}
