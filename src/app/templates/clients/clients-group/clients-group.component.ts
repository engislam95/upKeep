import { HeadersService } from "src/app/tools/shared-services/headers.service";
import { Component, OnInit } from "@angular/core";
import { CoreService } from "./../../../tools/shared-services/core.service";
import { LoaderService } from "../../../tools/shared-services/loader.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-clients-group",
  templateUrl: "./clients-group.component.html",
  styleUrls: ["./clients-group.component.scss"],
})
export class ClientsGroupComponent implements OnInit {
  user: any = "";
  uploadForm: FormGroup;
  constructor(
    private loaderService: LoaderService,
    private coreService: HttpClient,
    private formBuilder: FormBuilder,
    private header: HeadersService
  ) {
    this.user = JSON.parse(localStorage.getItem("currentUser"));
  }
  pageLoaded: boolean = true;
  file: any = "";
  name: string = "";
  checked: boolean = false;
  arr = [];
  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      profile: [""],
    });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get("profile").setValue(file);
      console.log(this.uploadForm.get("profile").value);
      this.name = file.name;
    }
  }
  onSubmit() {
    let pro = document.forms.namedItem("profileForm");
    console.log(pro);

    const formData = new FormData(pro);
    console.log(formData);

    formData.append(
      "excel_file",
      this.uploadForm.get("profile").value,
      this.uploadForm.get("profile").value.name
    );
    console.log(formData);
    console.log(this.uploadForm.get("profile").value);

    formData.append("excel_file", formData);
    this.coreService
      .post(
        this.header.baseAPI +
          "api/company/" +
          this.header.companySlug +
          "/clients/uploadBulk",
        { excel_file: formData },
        {
          headers: {
            // Accept: "multipart/form-data",
            "Content-type": "application/vnd.ms-excel",
            Accept: "application/json",
            Authorization: "Bearer " + this.header.token,
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      )
      .subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
      );
  }
  // Upload Excel File
  updateExcel(event) {
    console.log(event);
  }

  // submitFile() {
  //   this.startLoading();
  //   // this.file = this.file.split(",")[1];
  //   this.coreService
  //     .postMethod("clients/uploadBulk", {
  //       excel_file: this.file,
  //     })
  //     .subscribe((data) => {
  //       this.endLoading();
  //       console.log(data);
  //     });
  // }
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
