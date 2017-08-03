import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as electron from 'electron';
import { Observable } from 'rxjs/Observable';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';



@Injectable()
export class VersionService {

  constructor(private _http: Http) { }

  getLatestVersion() {
    electron.ipcRenderer.send('latestVersion');
  }

  getCurrentVersion() {
    electron.ipcRenderer.send('version');
  }
}
