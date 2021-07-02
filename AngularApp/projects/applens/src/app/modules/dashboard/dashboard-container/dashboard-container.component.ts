import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ApplensGlobal } from '../../../applens-global';
import { DiagnosticApiService } from '../../../shared/services/diagnostic-api.service';
import { ObserverService } from '../../../shared/services/observer.service';
import { ResourceService } from '../../../shared/services/resource.service';
import { StartupService } from '../../../shared/services/startup.service';

@Component({
  selector: 'dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss']
})
export class DashboardContainerComponent implements OnInit {

  keys: string[];
  resource: any;
  resourceReady: Observable<any>;
  resourceDetailsSub: Subscription;
  observerLink: string = "";

  constructor(public _resourceService: ResourceService, private _startupService: StartupService, private _diagnosticApiService: DiagnosticApiService, private _observerService: ObserverService, private _applensGlobal: ApplensGlobal) { }

  ngOnInit() {
    let serviceInputs = this._startupService.getInputs();
    this.resourceReady = this._resourceService.getCurrentResource();
    this.resourceReady.subscribe(resource => {
      if (resource) {
        this.resource = resource;

        if (serviceInputs.resourceType.toString() === 'Microsoft.Web/hostingEnvironments' && this.resource && this.resource.Name) {
          this.observerLink = "https://wawsobserver.azurewebsites.windows.net/MiniEnvironments/" + this.resource.Name;
        }
        else if (serviceInputs.resourceType.toString() === 'Microsoft.Web/sites') {
          this.observerLink = "https://wawsobserver.azurewebsites.windows.net/sites/" + this.resource.SiteName;
        }

        this.keys = Object.keys(this.resource);
        this.replaceResourceEmptyValue();
        this.updateVentAndLinuxInfo();
      }
    });
  }

  updateVentAndLinuxInfo() {
    if (this.keys.indexOf('VnetName') == -1 && this.resourceReady != null && this.resourceDetailsSub == null) {
      this.resourceDetailsSub = this.resourceReady.subscribe(resource => {
        if (resource) {
          this._observerService.getSiteRequestDetails(this.resource.SiteName, this.resource.InternalStampName).subscribe(siteInfo => {
            this.resource['VnetName'] = siteInfo.details.vnetname;
            this.keys.push('VnetName');

            if (this.resource['IsLinux']) {
              this.resource['LinuxFxVersion'] = siteInfo.details.linuxfxversion;
              this.keys.push('LinuxFxVersion');
            }

            this.replaceResourceEmptyValue();
          });
        }
      });
    }
  }

  replaceResourceEmptyValue() {
    this.keys.forEach(key => {
      if (this.resource[key] === "") {
        this.resource[key] = "N/A";
      }
    });
  }

  openFeedback() {
    this._applensGlobal.openFeedback = true;
  }

}
