import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _mdl from '@app/models/index';

@Injectable()
export class WSService
{
    private apiUrl = 'http://localhost:5000/api/WS'; // Change to your API URL

    constructor(private http: HttpClient) { }

    getWSList(): Observable<_mdl.WSModel[]>
    {
        return this.http.get<_mdl.WSModel[]>(this.apiUrl);
    }

    getWSById(id: number): Observable<_mdl.WSModel>
    {
        return this.http.get<_mdl.WSModel>(`${this.apiUrl}/${id}`);
    }

    createWS(WS: _mdl.WSModel): Observable<_mdl.WSModel>
    {
        return this.http.post<_mdl.WSModel>(this.apiUrl, WS);
    }

    updateWS(WS: _mdl.WSModel): Observable<void>
    {
        return this.http.put<void>(`${this.apiUrl}/${WS.id}`, WS);
    }
}
