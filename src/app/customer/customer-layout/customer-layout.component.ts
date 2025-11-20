import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CustomerFooterComponent } from './customer-footer/customer-footer.component';
import { CustomerHeaderComponent } from './customer-header/customer-header.component';


@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    CustomerFooterComponent,
    CustomerHeaderComponent,
    
  ],
  templateUrl: './customer-layout.component.html',
  styleUrls: ['./customer-layout.component.css']
})
export class CustomerLayoutComponent {}
