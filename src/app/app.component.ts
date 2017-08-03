import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import * as electron from 'electron';
import 'rxjs/add/operator/do';


import { VersionService } from './version.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  latest: number;
  current: number;
  versionEqual: boolean;
  footerMessage: string;

  constructor(private _versionService: VersionService, private _ngZone: NgZone) {

  }
  ngOnInit() {
    electron.ipcRenderer.on('version-reply', (event, version: number) => {
      this._ngZone.run(() => {
        this.current = version;
        this.compareVersions();
      });
    });

    electron.ipcRenderer.on('latestVersion-reply', (event, version: number) => {
      this._ngZone.run(() => {
        this.latest = version;
        this.compareVersions();
      });
    });

    electron.ipcRenderer.on('update-done', (event) => {
      electron.ipcRenderer.send('set-latest-version', this.latest);
      this._versionService.getCurrentVersion();
    });

    electron.ipcRenderer.on('error', (event, message: string) => {
      // const toast = document.getElementById('error-toast');
      // toast.MaterialSnackbar.showSnackbar({ message });
    });
    this.getVersions();
  }

  ngOnDestroy() {
    electron.ipcRenderer.removeAllListeners();
  }

  private compareVersions() {
    this.versionEqual = this.latest === this.current;
    this.footerMessage = this.versionEqual
      ? 'Package is up to date'
      : 'An update is available';
  }

  getLatestVersion() {
    this.footerMessage = 'Checking for updates';
    this._versionService.getLatestVersion();
  }

  private getVersions() {
    this.getLatestVersion();
    this._versionService.getCurrentVersion();
  }

  update() {
    this.footerMessage = 'Updating...';
    electron.ipcRenderer.send('update');
  }
}
