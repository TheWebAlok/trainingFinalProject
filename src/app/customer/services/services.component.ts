import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AddServicesService } from '../../services/services/services.service';
import { Services } from '../../shared/models/services/services.model';
import { CartService } from '../../services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
      
  servicesList: Services[] = [];

  constructor(
    private serviceService: AddServicesService,
    private cartService: CartService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit(){
    this.getServices();
  }

  getServices() {
    this.serviceService.getAllServices().subscribe(
      (services: Services[]) => {
        this.servicesList = services.filter(s => s.status === true);
      },
      (err) => {
        console.error("Services load error:", err);
      }
    );
  }

  bookServices(service: Services) {
    if (!this.authService.getIsLoggedIn()) {
      this.toastr.error("Please login first!");
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/serviceBook', service.id]);
  }
}
