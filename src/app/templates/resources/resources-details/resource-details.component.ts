import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/tools/shared-services/loader.service';
import { CoreService } from 'src/app/tools/shared-services/core.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-resource-details',
  templateUrl: './resource-details.component.html',
  styleUrls: ['./resource-details.component.scss']
})
export class ResourcesDetailsComponent implements OnInit {
  // dataSource = [];
  pageLoaded = false;
  resourcesId;
  resourcesDetails;
  user: any = '';
  resource_add: boolean = false;
  resources_all: boolean = false;
  resources_update: boolean = false;
  resources_delete: boolean = false;
  resoureces: any = [];
  constructor(
    private loaderService: LoaderService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    this.resoureces = this.user.modules.resources;
    if (this.resoureces) {
      this.resoureces.map(ele => {
        switch (ele) {
          case 'create': this.resource_add = true;
            break;
          case 'all': this.resources_all = true;
            break;
          case 'delete': this.resources_delete = true;
            break;
          case 'update': this.resources_update = true;
            break;
        }
      });
    }
  }
  ngOnInit() {
    // // Start START Loading
    this.startLoading();
    // // End START Loading
    this.activatedRoute.queryParams.subscribe(params => {
      this.resourcesId = params.resourcesId;
      this.coreService.getMethod('resources/' + this.resourcesId, {}).subscribe((resourcesDetails: any) => {
        this.resourcesDetails = resourcesDetails.data;
        // Start END Loading
        this.endLoading();
        // End END Loading
      });
    });
  }

  editnavigate() {
    this.router.navigate(['/resources/update-resource'], {
      queryParams: this.resourcesId
    });
  }


  //  ######################### Start Loading Functions #########################
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
  }
  //  ######################### End Loading Functions #########################
}
