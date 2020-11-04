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

  dataURLtoFile(dataurl, filename) {
    console.log(dataurl);

    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
  // Upload Excel File
  updateExcel(event) {
    console.log(event);
    var inputURL = event[0].base64;

    var blobObject = blobCreationFromURL(inputURL);
    // Create Blob file from URL
    function blobCreationFromURL(inputURI) {
      var binaryVal;

      // mime extension extraction
      var inputMIME = inputURI.split(",")[0].split(":")[1].split(";")[0];

      // Extract remaining part of URL and convert it to binary value
      if (inputURI.split(",")[0].indexOf("base64") >= 0)
        binaryVal = atob(inputURI.split(",")[1]);
      // Decoding of base64 encoded string
      else binaryVal = unescape(inputURI.split(",")[1]);

      // Computation of new string in which hexadecimal
      // escape sequences are replaced by the character
      // it represents

      // Store the bytes of the string to a typed array
      var blobArray: any = [];
      for (var index = 0; index < binaryVal.length; index++) {
        blobArray.push(binaryVal.charCodeAt(index));
      }

      return new Blob([blobArray], {
        type: inputMIME,
      });
    }
    console.log(blobObject);

    var fdataobj = new FormData();

    // Create formdata object and append the object
    // file to the name 'Blob file'
    fdataobj.append("Blob File", blobObject);
    for (var pair of fdataobj.entries()) {
      alert("GeeksforGeeks\n" + pair[0] + "–" + pair[1]);
    }
    console.log(fdataobj);
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
