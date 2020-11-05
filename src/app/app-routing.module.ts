import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      // {
      //   path: 'system-managment', component: SystemManagmentComponent, canActivate: [AuthGuard]
      // },
      {
        path: 'system-managment',
        loadChildren: './templates/system-managment/system-managment.module#SystemManagmentModule'
      },
      {
        path: 'system-off',
        loadChildren: './templates/system-off/system-off.module#SystemOffModule'
      },

      // {
      //   path: 'system-off', component: SystemOffComponent, canActivate: [AuthGuard]
      // },
      
      // { path: 'access', loadChildren: './templates/access/access.module#AccessModule' },
      {
        path: 'orders',
        loadChildren: './templates/orders/orders.module#OrdersModule'
      },
      {
        path: 'sales',
        loadChildren: './templates/sales/sales.module#SalesModule'
      },
      {
        path: 'clients',
        loadChildren: './templates/clients/clients.module#ClientsModule'
      },
      {
        path: 'password',
        loadChildren: './templates/password/password.module#PasswordModule'
      },
      {
        path: 'invoices',
        loadChildren: './templates/invoices/invoices.module#InvoicesModule'
      },
      {
        path: 'technicians',
        loadChildren:
          './templates/technicians/technicians.module#TechniciansModule'
      },
      {
        path: 'resources',
        loadChildren: './templates/resources/resources.module#ResourcesModule'
      },
      {
        path: 'offers',
        loadChildren: './templates/offers/offers.module#OffersModule'
      },
      {
        path: 'services',
        loadChildren: './templates/services/services.module#ServicesModule'
      },
      {
        path: 'company-services',
        loadChildren:
          './templates/company-services/company-services.module#CompanyServicesModule'
      },
      { path: 'home', loadChildren: './templates/home/home.module#HomeModule' },
      {
        path: 'managment',
        loadChildren: './templates/managment/managment.module#ManagmentModule'
      },
      {
        path: 'owner',
        loadChildren: './templates/owner/owner.module#OwnerModule'
      },
      {
        path: 'receipts-managment',
        loadChildren:
          './templates/receipts-managment/receipts-managment.module#ReceiptsManagmentModule'
      },
      {
        path: 'receipts-managment/receipts-templates',
        loadChildren:
          './templates/rec-templates/rec-templates.module#RecTemplatesModule'
      },
      {
        path: 'receipts-managment/all-models',
        loadChildren: './templates/rec-models/rec-models.module#RecModelsModule'
      },
      {
        path: 'receipts-managment/all-taxes',
        loadChildren: './templates/taxes/taxes.module#TaxesModule'
      },
      {
        path: 'receipts-managment/all-blocks',
        loadChildren: './templates/block/block.module#BlockModule'
      },
      {
        path: 'receipts-managment/invoice-settings',
        loadChildren:
          './templates/invoice-settings/invoice-settings.module#InvoiceSettingsModule'
      },
      {
        path: 'receipts-managment/charts',
        loadChildren: './templates/charts/charts.module#ChartsModule'
      },
      {
        path: 'receipts-managment/reports',
        loadChildren: './templates/reports/reports.module#ReportsModule'
      },
      {
        path: 'users',
        loadChildren: './templates/users/users.module#UsersModule'
      },
      {
        path: 'roles',
        loadChildren: './templates/roles/roles.module#RolesModule'
      },
      {
        path: 'companies',
        loadChildren: './templates/companies/companies.module#CompaniesModule'
      },

      {
        path: 'classifications',
        loadChildren:
          './templates/classifications/classifications.module#ClassificationsModule'
      },
      {
        path: 'permissions',
        loadChildren:
          './templates/permissions/permissions.module#PermissionsModule'
      },
      {
        path: 'locations-managment',
        loadChildren:
          './templates/locations-managment/locations-managment.module#LocationsManagmentModule'
      }
    ]
  },
  {
    path: 'access',
    canActivate: [LoginGuard],
    loadChildren: './templates/access/access.module#AccessModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
