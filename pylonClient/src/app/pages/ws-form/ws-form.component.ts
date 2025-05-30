import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import * as _mdl from '@app/models/index';
import * as _svc from '@app/services/index';

@Component({
  selector: 'app-ws-form',
  standalone: true,
  imports: [
    RouterOutlet,
    NgbDropdownModule,
    CommonModule,
    FormsModule,
    NgLabelTemplateDirective,
    NgOptionTemplateDirective,
    NgSelectComponent],
  providers: [_svc.WSService],
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
