import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { AddServicesService } from '../../../services/services/services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-services.component.html',
  styleUrls: ['./edit-services.component.css']
})
export class EditServicesComponent implements OnInit {
      
  service: any = {
    name: '',
    price: 0,
    description: '',
    imageUrl: ''
  };

  serviceId: string = '';
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private serviceService: AddServicesService,
    private cloudinaryService: CloudinaryService
  ) {}

  ngOnInit() {

    this.serviceId = this.route.snapshot.paramMap.get('id') || '';

    if (this.serviceId) {
      this.serviceService.getSingleService(this.serviceId).subscribe((res: any) => {
        this.service = res;
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }


  updateService() {
    if (!this.serviceId) return;

    if (this.selectedFile) {
      this.cloudinaryService.uploadImage(this.selectedFile).subscribe((res: any) => {
        const imageUrl = res.secure_url;
        this.service.imageUrl = imageUrl;

       
        this.serviceService.updateService(this.serviceId, this.service).then(() => {
          this.toastr.success('Service updated with new image!');
          this.router.navigate(['/admin/viewServices']);
        });
      });
    } else {
    
      this.serviceService.updateService(this.serviceId, this.service).then(() => {
        this.toastr.success('Service updated successfully!');
        this.router.navigate(['/admin/viewServices']);
      });
    }
  }
}
