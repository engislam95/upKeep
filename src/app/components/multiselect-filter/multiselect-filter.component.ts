import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-multiselect-filter',
  templateUrl: './multiselect-filter.component.html',
  styleUrls: ['./multiselect-filter.component.scss']
})
export class MultiselectFilterComponent {
  /* ------------------------- Variables ----------------------- */
  isOpen: boolean = false;
  openFilterList: boolean = false;
  selectedIds: any = [];
  filterListValue: any = '';
  /* ----------------------- Input --------------------------- */
  @Input() multiSelectList = [];
  @Input() multiSelectListType = 'single';
  @Input() multiSelectListPlaceholder: string = '';
  @Input() componentId: string = '';
  /* ------------------ Output ------------------------- */
  @Output() search: EventEmitter<any> = new EventEmitter();
  /*
  There is 2 types of Multi-select List: 
  1- Nested List => Tehnicians With Service
  2- Single List => Order State List
  */
  /* ----------------------------- Check Box Select Event --------------------- */
  checkBoxSelected(checkEvent) {
    if (this.componentId != 'filterServices') {
      // Select Parent
      if (checkEvent.source.value.id && !checkEvent.source.value.parentId) {
        const serviceId = checkEvent.source.value.id;
        if (this.multiSelectListType === 'nested') {
          this.selectNestedParent(checkEvent, serviceId, this.componentId);
        } else {
          this.selectSingleType(checkEvent);
        }
      } else {
        // Select Technician - Child
        if (this.componentId != 'filterServices') {
          const parentId = checkEvent.source.value.parentId;
          this.selectNestedChild(checkEvent, parentId);
        }
      }
    }
    if (this.componentId == 'filterServices') {
      // Select Parent
      if (checkEvent.source.value.id && !checkEvent.source.value.parent) {
        const serviceId = checkEvent.source.value.id;
        if (this.multiSelectListType === 'nested') {
          this.selectNestedParent(checkEvent, serviceId, this.componentId);
        } else {
          this.selectSingleType(checkEvent);
        }

      } else {
        if (this.componentId == 'filterServices') {
          const parentId = checkEvent.source.value.parent;
          this.selectNestedChild(checkEvent, parentId);
        }
      }
    }
    this.setCheckedValuesToInput();
  }
  /* -------------------- Set Values To Inputs ----------------------------- */
  setCheckedValuesToInput() {
    // Set Value To Input Showing What You Have Selected
    // Also Get Selectd IDs
    this.selectedIds = [];
    this.filterListValue = '';
    if (this.multiSelectListType === 'nested' && this.componentId === 'filterTechnicians') {
      this.multiSelectList.forEach(service => {
        service.technicians.forEach(technical => {
          if (technical.checked === true) {
            this.selectedIds.push(technical.id);
            this.filterListValue += technical.name + ' , ';
          }
        });
      });
    }
    else if (this.multiSelectListType === 'nested' && this.componentId === 'filterServices') {
      this.multiSelectList.forEach(service => {
        if (service.children.length) {
          service.children.forEach(child => {
            if (child.checked === true) {
              this.selectedIds.push(child.id);
              this.filterListValue += child.name + ' , ';
            }
          });
        }
      });
      console.log('SELECTED IDs ', this.selectedIds);
      console.log(this.filterListValue);
    } else {
      this.multiSelectList.forEach(status => {
        if (status.checked === true) {
          this.selectedIds.push(status.id);
          this.filterListValue += status.name + ' , ';
        }
      });
    }
    this.filterListValue = this.filterListValue.substr(0, this.filterListValue.length - 2);
  }
  /* ----------------------- Select From Single Type ----------------------------- */
  selectSingleType(checkEvent) {
    const statusId = checkEvent.source.value.id;
    this.multiSelectList.forEach(status => {
      if (statusId === status.id) {
        status.checked = checkEvent.checked;
      }
    });
  }
  /* ------------------- Select Nested Parent ----------------------- */
  selectNestedParent(checkEvent, serviceId, componentID) {
    this.multiSelectList.forEach(service => {
      if (serviceId === service.id && componentID != 'filterServices') {
        service.checked = checkEvent.checked;
        service.technicians.forEach(technical => {
          technical.checked = service.checked;
        });
      }
      if (serviceId === service.id && componentID == 'filterServices') {
        service.checked = checkEvent.checked;
        service.children.forEach(child => {
          child.checked = service.checked;
        });
      }
    });
  }
  /* ------------------------- Select Nested Child --------------------------- */
  selectNestedChild(checkEvent, parentId) {
    let allChecked = false;
    if (this.componentId != 'filterServices') {
      this.multiSelectList.forEach(service => {
        if (parentId === service.id) {
          service.technicians.forEach(technical => {
            if (checkEvent.source.value.id === technical.id) {
              technical.checked = checkEvent.checked;
            }
          });
          allChecked = service.technicians.some(technical => {
            return technical.checked === false;
          });
          service.checked = !allChecked;
        }
      });
    }
    if (this.componentId == 'filterServices') {
      this.multiSelectList.forEach(service => {
        if (parentId === service.id) {
          service.children.forEach(child => {
            if (checkEvent.source.value.id === child.id) {
              child.checked = checkEvent.checked;
            }
          });
          allChecked = service.children.some(child => {
            return child.checked === false;
          });
          service.checked = !allChecked;
        }
      });
    }
  }
  /* ------------------------------- Search With Filtered IDs -------------------------- */
  searchWithFiltered() {
    this.search.emit({ data: this.selectedIds, type: this.componentId });
    setTimeout(() => {
      this.openFilterList = false;
    }, 300);
  }
  /* ----------------------------- Open Filter List ----------------------- */
  openFilterListFn(componentId) {
    const listId = componentId;
    if (!this.isOpen) {
      this.openFilterList = true;
      setTimeout(() => {
        (document.querySelector(`#${listId}`) as HTMLElement).focus();
      }, 200);
    }
    this.isOpen = false;
  }
  /* ------------------------- Close Filter List ---------------------------- */
  closeFilterListFn(e, componentId) {
    if (!e.relatedTarget) {
      this.openFilterList = false;
      this.isOpen = true;
      setTimeout(() => {
        this.isOpen = false;
      }, 300);
    }
  }
}
