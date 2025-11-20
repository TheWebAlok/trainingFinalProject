import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Services } from '../../../shared/models/services/services.model';
import { AddServicesService } from '../../../services/services/services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-services.component.html',
  styleUrls: ['./all-services.component.css'] // ✅ fixed
})
export class AllServicesComponent implements OnInit {
  servicesList: Services[] = [];

  constructor(
    private router: Router,
    private serviceService: AddServicesService,
  ) { }

  ngOnInit(){
    this.getAllServices();
  }


  getAllServices() {
    this.serviceService.getAllServices().subscribe((data: Services[]) => {
      this.servicesList = data;
    });
  }


  editService(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to edit this service?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, edit it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/admin/edit-service', id]);
      }
    });
  }

  deleteService(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this service!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceService.deleteService(id).then(() => {
          Swal.fire('Deleted!', 'Service has been deleted.', 'success');
          this.getAllServices();
        });
      }
    });
  }
}
