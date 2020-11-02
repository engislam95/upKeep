import { ClientsGroupComponent } from "./clients-group/clients-group.component";
import { AddNewMapComponent } from "./add-new-map/add-new-map.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ClientDetailsComponent } from "./client-details/client-details.component";
import { AddClientComponent } from "./add-client/add-client.component";
import { AllClientsComponent } from "./all-clients/all-clients.component";

const routes: Routes = [
  //
  { path: "client-details", component: ClientDetailsComponent },
  { path: "clients-group", component: ClientsGroupComponent },
  { path: "add-client", component: AddClientComponent },
  { path: "update-client", component: AddClientComponent },
  { path: "edit-client", component: AddClientComponent },
  { path: "all-clients", component: AllClientsComponent },
  { path: "add-new-map", component: AddNewMapComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsRoutingModule {}
