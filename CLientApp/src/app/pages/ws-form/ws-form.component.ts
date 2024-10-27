import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _mdl from '@app/models/index';
import * as _svc from '@app/services/index';

@Component({
  selector: 'app-ws-form',
  templateUrl: './ws-form.component.html',
})
export class WSFormComponent
{
  ws: _mdl.WSModel = new _mdl.WSModel();
  isEditMode: boolean = false;

  selectedCar?: number;
  services = [];
  categories = [];

  constructor(
    private _WSSvc: _svc.WSService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void
  {
    const id = this.route.snapshot.paramMap.get('id');
    if (id)
    {
      this.isEditMode = true;
      this._WSSvc.getWSById(+id).subscribe((data) =>
      {
        this.ws = data;
      });
    }
  }

  onSubmit(): void
  {
    if (this.isEditMode)
    {
      this._WSSvc.updateWS(this.ws).subscribe(() =>
      {
        this.router.navigate(['/']);
      });
    } else
    {
      this._WSSvc.createWS(this.ws).subscribe(() =>
      {
        this.router.navigate(['/']);
      });
    }
  }

}
