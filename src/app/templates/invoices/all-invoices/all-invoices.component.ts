import { HeadersService } from "./../../../tools/shared-services/headers.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

import { CoreService } from "./../../../tools/shared-services/core.service";
import { LoaderService } from "../../../tools/shared-services/loader.service";
import { ResponseStateService } from "../../../tools/shared-services/response-state.service";
import { PaginationService } from "./../../../tools/shared-services/pagination.service";
import { fromEvent, Observable } from "rxjs";
import {
  map,
  debounceTime,
  distinctUntilChanged,
  startWith,
} from "rxjs/operators";
import { FormGroup, FormControl } from "@angular/forms";
import { SelectionModel } from "@angular/cdk/collections";
import * as XLSX from "xlsx";

@Component({
  selector: "app-all-invoices",
  templateUrl: "./all-invoices.component.html",
  styleUrls: ["./all-invoices.component.scss"],
})
export class AllInvoicesComponent implements OnInit {
  //
  // ─── START GENERAL DATA ──────────────────────────────────────────
  //
  showAddNumberPopup = false;
  statisticsRow = false;
  todayDate = new Date().toLocaleDateString("en-US");
  printCase = true;
  excel = false;
  pdf = false;
  justPrint = false;
  pageLoaded = false;
  responseState;
  responseData;
  baseAPI;
  Task = {
    subtasks: [
      { name: "نوع الفاتورة", completed: false },
      { name: "اسم العميل", completed: false },
      { name: "اسم الفنى	", completed: false },
      { name: "الخدمة", completed: false },
      { name: "الحالة", completed: false },
    ],
  };
  Taskt = {
    subtasks: [
      { name: "رقم الفاتورة", completed: false },
      { name: "رقم الطلب", completed: false },
      { name: "التاريخ", completed: false },
      { name: "اجمالى الفاتورة", completed: false },
    ],
  };
  filterArray: any = [];
  displayColums2 = [];
  dataSource2 = [];
  //
  // ────────────────────────────────────────── END GENERAL DATA ─────
  //
  @ViewChild("TABLE") TABLE: ElementRef;

  //  Start Fillter invoices Variable Data

  filteredInvoicesData = "";
  filteredInvoicesDate = "";
  filteredInvoicesNumber = "";
  fillteredInvicesType = "";
  filteredFromDate = "";
  filteredToDate = "";
  filterOrderIdNumberData = "";
  getInvoicesCounts: any = 0;
  inoviceStatus: any = "";
  todayFilltered = 0;

  //  End Fillter invoices Variable Data
  // ###################################### Table Data ######################################
  displayedColumns = [
    //
    "ID",
    "invoice_number",
    "client_name",
    "number_order",
    "service_date",
    "order_status",
    "service_order",
    "technicians",
    "status",
    "total_invoice",
    // 'invoice_status',
    // 'invoice_detailss',
    "invoice_details",
  ];
  showOrdercontrolst = false;

  dataSource = [];
  selection = new SelectionModel<any>(true, []);

  pagesNumbers = [];
  pageId = 1; // number
  firstPage; // any
  lastPage;
  hideme = [];
  filterStatusComponentId = "filterStatus";
  filterStatus = []; // filtered ids
  show: any = false;
  per_page = 10;
  // ########################
  //  ###################### Start Select Status ######################

  filterForm = new FormGroup({
    statusObj: new FormControl(),
    InvoicesNumber: new FormControl(),
    filterName: new FormControl(),
    filterOrderIdNumber: new FormControl(),
    startDateFilter: new FormControl(),
    endDateFilter: new FormControl(),
    status: new FormControl(),
    // filterListControlName: new FormControl()
  });
  invoicesFilterByService = [];
  serviceFilteredOptions: Observable<any>;
  invoicesTypeLoaded = false;
  getInvoicesTotal;
  getInvoicesData;
  getInvoicesCurrency;
  countPerPage = [];
  //  ###################### End Select Status ######################
  data: any = "";
  taxesArray = [];
  // TODO
  //
  // ─── START MULTIPLE SELECT FILTER ─────────────────
  //

  // serviceArray = [];

  //
  // ── END MULTIPLE SELECT FILTER ─────
  //
  // TODO
  receipt_all: boolean = false;
  receipt_add: boolean = false;
  receipt_update: boolean = false;
  receipt_delete: boolean = false;
  receipts: any = [];
  user: any = "";
  filterTechnicians = []; // filtered ids
  ids = [];

  servicesWithTechniciansList = [];
  techniciansFilterPlaceholder = "إسم الفني او الخدمة";
  nestedType = "nested";
  filterTechniciansComponentId = "filterTechnicians";

  current_page: any = "";
  totalPage: any = "";

  // ###################################### Table Data ######################################
  constructor(
    //
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private headersService: HeadersService,
    private paginationService: PaginationService
  ) {
    this.user = JSON.parse(localStorage.getItem("currentUser"));
    this.receipts = this.user.modules.receipts;
    if (this.receipts) {
      this.receipts.map((ele) => {
        switch (ele) {
          case "create":
            this.receipt_add = true;
            break;
          case "show":
            this.receipt_all = true;
            break;
          case "update":
            this.receipt_update = true;
            break;
          case "delete":
            this.receipt_delete = true;
            break;
        }
      });
    }
  }

  getFilter(val, name) {
    console.log(val);
    if (val && this.filterArray.indexOf(name) === -1) {
      this.filterArray.push(name);
    } else {
      this.filterArray.splice(this.filterArray.indexOf(name), 1);
    }
    this.displayColums2 = this.filterArray;
  }

  filterPrint() {
    this.excel = false;
    this.pdf = false;

    this.startLoading();
    this.coreService
      .getMethod("receipts", {
        client: this.filteredInvoicesData,
        order_id: this.filterOrderIdNumberData,
        date: this.filteredInvoicesDate,
        receipt_number: this.filteredInvoicesNumber,
        receipt_type_id: this.fillteredInvicesType,
        from: this.filteredFromDate,
        to: this.filteredToDate,
        today: this.todayFilltered,
        "technician_ids[]": this.filterTechnicians,
        status: this.inoviceStatus,
      })
      .subscribe(
        (getClientsResponse: any) => {
          this.endLoading();
          console.log(getClientsResponse);
          this.dataSource2 = getClientsResponse.data.receipts;
          this.showAddNumberPopup = false;
          this.printCase = false;

          setTimeout(() => {
            window.print();
          }, 2000);
        },
        (error) => {
          this.showAddNumberPopup = false;
          if (error.error.errors) {
            this.showErrors(error.error.errors);
          } else {
            this.showErrors(error.error.message);
          }
        }
      );
  }

  ExportTOExcel() {
    this.justPrint = false;
    this.pdf = false;
    this.startLoading();
    this.coreService
      .getMethod("receipts", {
        client: this.filteredInvoicesData,
        order_id: this.filterOrderIdNumberData,
        date: this.filteredInvoicesDate,
        receipt_number: this.filteredInvoicesNumber,
        receipt_type_id: this.fillteredInvicesType,
        from: this.filteredFromDate,
        to: this.filteredToDate,
        today: this.todayFilltered,
        "technician_ids[]": this.filterTechnicians,
        status: this.inoviceStatus,
      })
      .subscribe(
        (getClientsResponse: any) => {
          this.endLoading();
          console.log(getClientsResponse);
          this.dataSource2 = getClientsResponse.data.receipts;
          this.showAddNumberPopup = false;
          this.printCase = false;
        },
        (error) => {
          this.showAddNumberPopup = false;
          if (error.error.errors) {
            this.showErrors(error.error.errors);
          } else {
            this.showErrors(error.error.message);
          }
        }
      );
    setTimeout(() => {
      console.log(this.TABLE);
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
        this.TABLE.nativeElement
      );

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "Receipts.xlsx");
    }, 4000);
  }

  showExcel() {
    this.showAddNumberPopup = true;
    this.excel = true;
    this.pdf = false;
    this.justPrint = false;
  }
  showPrint() {
    this.showAddNumberPopup = true;
    this.excel = false;
    this.pdf = false;
    this.justPrint = true;
  }

  showPdf() {
    this.showAddNumberPopup = true;
    this.excel = false;
    this.pdf = true;
    this.justPrint = false;
  }

  //
  // ─── START ONINIT ────────────────────────────────────────────────
  //
  action(event) {
    if (event == true) {
      this.show = true;
    } else if (event == false) {
      this.show = false;
    }
    const ids = [];
    this.selection.selected.forEach((item) => {
      const index: number = this.data.findIndex((d) => d === item);
      ids.push(item.id);
      this.ids = ids;
    });
    console.log(ids);
  }

  applyAction(key) {
    this.startLoading();
    this.coreService
      .updateMethod("receipts/makeAction", {
        action: key,
        ids: this.ids,
      })
      .subscribe(
        (data) => {
          console.log(data);
          if (key == "undocancel") {
            this.showSuccess("تم ارجاع الفاتورة");
          }
          if (key == "cancel") {
            this.showSuccess("تم الغاء الفاتورة");
          }
          if (key == "undoconfirm") {
            this.showSuccess("تم الغاء اعتماد الفاتورة");
          }
          if (key == "confirm") {
            this.showSuccess("تم اعتماد الفاتورة");
          }
          this.endLoading();
          this.getAllInvoices(this.pageId);
        },
        (error) => {
          if (error.error.errors) {
            this.showErrors(error.error.errors);
          } else {
            this.showErrors(error.error.message);
          }
        }
      );
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row) => this.selection.select(row));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.position + 1
    }`;
  }

  rowAction(row, key) {
    this.startLoading();
    this.coreService
      .updateMethod("receipts/makeAction", {
        action: key,
        ids: [row.id],
      })
      .subscribe(
        (data) => {
          console.log(data);
          if (key == "cancel") {
            this.showSuccess("تم الغاء الفاتورة");
          }
          if (key == "undocancel") {
            this.showSuccess("تم ارجاع الفاتورة");
          }
          if (key == "undoconfirm") {
            this.showSuccess("تم الغاء اعتماد الفاتورة");
          }
          if (key == "confirm") {
            this.showSuccess("تم اعتماد الفاتورة");
          }
          this.getAllInvoices(this.pageId);
          this.endLoading();
        },
        (error) => {
          if (error.error.errors) {
            this.showErrors(error.error.errors);
          } else {
            this.showErrors(error.error.message);
          }
        }
      );
  }

  ngOnInit() {
    // Start START Loading
    this.startLoading();
    // End START Loading
    // Start getServices
    this.getServicesWithTechnicians();

    // End getServices

    // Start Get All Clients
    this.getAllInvoices(this.pageId);
    // End Get All Clients

    this.baseAPI = this.headersService.baseAPI + "rc/";

    //
    // ─── START FILTER CLIENT NAME ────────────────────────────────────
    //

    const filterName = document.getElementById("filterName");
    const filterNameListner = fromEvent(filterName, "keyup");
    filterNameListner
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        this.pageId = 1;
        this.filteredInvoicesData = value;
        this.getAllInvoices(this.pageId);
      });
    //
    // ──────────────────────────────────── END FILTER CLIENT NAME ─────
    //

    //
    // ─── START FILTER INVOICES BY ORDER NUMBER────────────────────────────────────
    //

    const filterOrderIdNumber = document.getElementById("filterOrderIdNumber");
    const filterilterOrdeListner = fromEvent(filterOrderIdNumber, "keyup");
    filterilterOrdeListner
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        this.pageId = 1;
        this.filterOrderIdNumberData = value;
        this.getAllInvoices(this.pageId);
      });
    //
    // ──────────────────────────────────── END FILTER CLIENT NAME ─────
    //

    //
    // ─── FILTER INVOICES FILLTER NUMBER ──────────────────────────────
    //

    const InvoicesNumber = document.getElementById("InvoicesNumber");
    const InvoicesNumberListner = fromEvent(InvoicesNumber, "keyup");
    InvoicesNumberListner.pipe(
      map((event: any) => event.target.value),
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe((value: any) => {
      this.pageId = 1;
      this.filteredInvoicesNumber = value;
      this.getAllInvoices(this.pageId);
    });

    //
    // ──────────────────────────────── END INVOICES FILTER NUMBER ─────
    //

    //
    // ─── START COUNT PERPAGE  ──────────────────────────────────
    //

    for (let option = 10; option <= 50; option += 10) {
      this.countPerPage.push(option);
    }
    //
    // ────────────────────────────────────── END COUNT PERPAGE ─────
    //
  }
  //
  // ──────────────────────────────────────────────── END ONINIT ─────
  //

  // START NOTE
  search(selectedData) {
    if (selectedData.type === this.filterStatusComponentId) {
      this.filterStatus = selectedData.data;
    } else if (selectedData.type === this.filterTechniciansComponentId) {
      this.filterTechnicians = selectedData.data;
    }
    this.getAllInvoices(this.pageId);
  }

  //
  // ─── START GET SERVICES WITH TECHNICIANS ────────────────────────────────────────
  //

  //
  // ──────────────────────────────────────── END GET SERVICES WITH TECHNICIANS ─────
  //

  getServicesWithTechnicians() {
    let servicesWithTechnicians = [];
    this.coreService
      .getMethod("services/active", { with_technicians: 1 })
      .subscribe((servicesWithTechniciansResponse: any) => {
        servicesWithTechnicians = servicesWithTechniciansResponse.data;
        servicesWithTechnicians = servicesWithTechnicians.map((service) => {
          return (service = {
            ...service,
            checked: false,
            technicians: service.technicians.map((technical) => {
              return (technical = {
                ...technical,
                parentId: service.id,
                checked: false,
              });
            }),
          });
        });
        this.servicesWithTechniciansList = servicesWithTechnicians;
      });
  }
  // END NOTE

  //
  // ─── START FILTER INVOICES ───────────────────────────────────────
  //

  filterInvoicesType(value: any) {
    if (typeof value === "object") {
      this.fillteredInvicesType = value.id;
      this.pageId = 1;
      this.getAllInvoices(this.pageId);
    }
    if (value === "") {
      this.fillteredInvicesType = "";
      this.pageId = 1;
      this.getAllInvoices(this.pageId);
    }
    return this.invoicesFilterByService.filter((option) =>
      option.name.includes(value)
    );
  }

  //
  // ────────────────────────────────── END FILTER INVOICES TYPE ─────
  //

  //
  // ─── START DISPLAY OPTIONS FOR SELECT ────────────────────────────
  //

  displayOptionsFunction(state) {
    if (state !== null) {
      return state.name;
    }
  }
  //
  // ──────────────────────────── END DISPLAY OPTIONS FOR SELECT ─────
  //

  //
  // ──────────────────────────────────────────────── END INVOICES FILLTER TYPE ─────
  //

  /*
    ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
                   Done Section
    ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  */

  //
  // ─────────────────────────────────────────────────────── START CHECKBOX ON CHANGE ─────
  //

  checkBoxOnChange(e) {
    if (e.checked) {
      this.statisticsRow = true;
    } else {
      this.statisticsRow = false;
    }
  }

  //
  // ─────────────────────────────────────────────────── END CHECKBOX ON CHANGE ─────
  //

  //
  // ─── START X RESET INPUTS ────────────────────────────────────────
  //

  xResetInputs(key) {
    if (key === "filterName") {
      this.filterForm.patchValue({
        filteredInvoicesData: "",
        filterName: "",
      });
      this.filteredInvoicesData = "";
    } else if (key === "InvoicesNumber") {
      this.filterForm.patchValue({
        filteredInvoicesNumber: "",
        InvoicesNumber: "",
      });
      this.filteredInvoicesNumber = "";
    } else if (key === "statusObj") {
      this.filterForm.patchValue({
        fillteredInvicesType: "",
        statusObj: "",
      });
    } else if (key === "dateInvoices") {
      this.filterForm.patchValue({
        filteredInvoicesDate: "",
        dateInvoices: "",
      });
      this.filteredInvoicesDate = "";
    } else if (key === "startDateFilter") {
      this.filterForm.patchValue({ filteredFromDate: "", startDateFilter: "" });
      this.filteredFromDate = "";
    } else if (key === "endDateFilter") {
      this.filterForm.patchValue({ filteredToDate: "", endDateFilter: "" });
      this.filteredToDate = "";
    }

    this.getAllInvoices(this.pageId);
  }

  //
  // ──────────────────────────────────────── END X RESET INPUTS ─────
  //

  //
  // ─── START FILTER'S TODAY ORDERS ────────────────────────────────────────────────────────
  //

  todayDateFillterToggle(e) {
    this.todayFilltered = e.checked === true ? 1 : 0;
    if (this.todayFilltered === 1) {
      this.filterForm.controls.startDateFilter.disable();
      this.filterForm.controls.endDateFilter.disable();
      (document.getElementById("filterStartDate") as HTMLInputElement).value =
        "";
      this.filteredFromDate = "";
      this.filteredToDate = "";
    } else {
      this.filterForm.controls.startDateFilter.enable();
      this.filterForm.controls.endDateFilter.enable();
    }
    this.pageId = 1;
    this.getAllInvoices(this.pageId);
  }

  //
  // ──────────────────────────────────────────────── END FILTER'S TODAY ORDERS ─────
  //

  //
  // ─── START GET ALL INVOICES ──────────────────────────────────────
  //

  statusInvoice(event) {
    console.log(event);
    this.inoviceStatus = event;
    this.getAllInvoices(this.pageId);
  }

  getAllInvoices(pageId, ...option) {
    this.loaderService.startLoading();
    this.coreService
      .getMethod("receipts?page=" + pageId, {
        client: this.filteredInvoicesData,
        order_id: this.filterOrderIdNumberData,
        date: this.filteredInvoicesDate,
        receipt_number: this.filteredInvoicesNumber,
        receipt_type_id: this.fillteredInvicesType,
        per_page: this.per_page,
        from: this.filteredFromDate,
        to: this.filteredToDate,
        today: this.todayFilltered,
        "technician_ids[]": this.filterTechnicians,
        status: this.inoviceStatus,
      })
      .subscribe((getInvoicesResponse: any) => {
        // Start Assign Data
        console.log(getInvoicesResponse);

        this.dataSource = getInvoicesResponse.data.receipts.data;
        this.data = Object.assign(getInvoicesResponse.data.receipts.data);
        this.getInvoicesTotal = getInvoicesResponse.data.receipts;
        this.getInvoicesCounts = getInvoicesResponse.data.counts;
        this.getInvoicesData = getInvoicesResponse.data.totals;
        this.getInvoicesCurrency = getInvoicesResponse.data.currency;
        this.taxesArray = getInvoicesResponse.data.totals.taxes;
        this.current_page = getInvoicesResponse.data.receipts.current_page;
        this.totalPage = getInvoicesResponse.data.receipts.last_page;

        if (this.dataSource.length === 0 && this.pageId > 1) {
          // last page
          this.pageId -= 1;
          this.pagesNumbers.splice(-1);
          this.goPage(this.pageId);
        }
        // Start Assign Data
        // Start END Loading
        this.endLoading();
        // End END Loading
        //  Start Pagination Count
        this.pagination(
          getInvoicesResponse.data.receipts.total,
          getInvoicesResponse.data.receipts.per_page
        );
        //  End Pagination Count
      });
  }
  nextPage(pageNum) {
    this.getAllInvoices(+pageNum + 1);
  }
  prevPage(pageNum) {
    this.getAllInvoices(+pageNum - 1);
  }
  //
  // ────────────────────────────────────── END GET ALL INVOICES ─────
  //

  //
  // ─── START COUNT PERPAGE  ──────────────────────────────────
  //
  setCountPerPage(option) {
    // Start START Loading
    this.startLoading();
    // End START Loading
    this.pageId = 1;
    this.per_page = option;
    this.getAllInvoices(this.pageId);
    // End Select
    this.endLoading();
    // End END Loading
  }
  //
  // ────────────────────────────────────── END COUNT PERPAGE ─────
  //

  //
  // ─── START FILTER ORDER DATE ────────────────────────────────────────────────────
  //

  invoicesDateChanged(event, type) {
    let invoicesDateArray;
    let invicesDate;
    invoicesDateArray = event.targetElement.value.split("/");
    invicesDate =
      invoicesDateArray[2] +
      "/" +
      invoicesDateArray[0] +
      "/" +
      invoicesDateArray[1];
    this.pageId = 1;
    type === "from"
      ? (this.filteredFromDate = invicesDate)
      : (this.filteredToDate = invicesDate);
    this.getAllInvoices(this.pageId);
  }
  //
  // ──────────────────────────────────────────────────── END FILTER ORDER DATE ─────
  //

  //
  // ─── START PAGINATION ────────────────────────────────────────────
  //

  pagination(totalClientsNumber, clientsPerPage) {
    this.pagesNumbers = [];
    const totalPages = Math.ceil(totalClientsNumber / clientsPerPage);
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      this.pagesNumbers.push(pageNumber);
    }
    this.checkPagination(this.pageId);
  }

  //
  // ──────────────────────────────────────────── END PAGINATION ─────
  //

  //
  // ─── START GO PAGE ───────────────────────────────────────────────
  //

  goPage(i) {
    if (i >= 1 && i <= this.pagesNumbers.length) {
      this.pageId = i;
      this.checkPagination(i);
      // Start START Loading
      this.startLoading();
      // End START Loading
      this.getAllInvoices(this.pageId);
    }
  }

  changePagination(event) {
    this.getAllInvoices(event.value);
  }

  //
  // ─────────────────────────────────────────────── END GO PAGE ─────
  //

  //
  // ─── START CHECK FOR PAGINATION BUTTONS ──────────────────────────
  //

  checkPagination(pageId) {
    const [firstPage, lastPage] = this.paginationService.checkPaginationButtons(
      pageId,
      this.pagesNumbers.length
    );
    this.firstPage = firstPage;
    this.lastPage = lastPage;
  }
  //
  // ────────────────────────── END CHECK FOR PAGINATION BUTTONS ─────
  //

  //
  // ─── START LOADING FUNCTIONS ─────────────────────────────────────
  //

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

  //
  // ─── START RESPONSE MESSEGES ─────────────────────────────────────
  //

  showErrors(errors) {
    this.endLoading();
    this.responseState = "error";
    this.responseData = errors;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  showSuccess(text) {
    this.endLoading();
    this.responseState = "success";
    this.responseData = text;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  //
  // ───────────────────────────────────── END RESPONSE MESSEGES ─────
  //
}
