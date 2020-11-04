import { Component, OnInit } from "@angular/core";
import { CoreService } from "./../../../tools/shared-services/core.service";
import { LoaderService } from "../../../tools/shared-services/loader.service";

@Component({
  selector: "app-clients-group",
  templateUrl: "./clients-group.component.html",
  styleUrls: ["./clients-group.component.scss"],
})
export class ClientsGroupComponent implements OnInit {
  user: any = "";
  constructor(
    private loaderService: LoaderService,
    private coreService: CoreService
  ) {
    this.user = JSON.parse(localStorage.getItem("currentUser"));
  }
  pageLoaded: boolean = true;
  file: any = "";
  name: string = "";
  checked: boolean = false;
  arr = [];
  ngOnInit() {}

  // Upload Excel File
  updateExcel(event) {
    console.log(event);
  }

  submitFile() {
    this.startLoading();
    // this.file = this.file.split(",")[1];
    this.coreService
      .postMethod("clients/uploadBulk", {
        excel_file: this.file,
      })
      .subscribe((data) => {
        this.endLoading();
        console.log(data);
      });
  }
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
  }

  //
  // ───────────────────────────────────── END LOADING FUNCTIONS ─────
  //
}
