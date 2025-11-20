import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { AddServicesService } from '../../../services/services/services.service';
import { Services } from '../../../shared/models/services/services.model';
import { CategoryService } from '../../../services/category/category.service';
import { Product } from '../../../shared/models/addProduct/add-product.model';

@Component({
  selector: 'app-add-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.css']
})
export class AddServicesComponent implements OnInit {

  categories: any[] = [];
  productObj: Product = {} as Product;

  service: Services = {
    id: '',
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    status: true,
    categoryId: '',
    categoryName: ''
  };

  selectedFile: File | null = null;

  constructor(
    private cloudinaryService: CloudinaryService,
    private serviceService: AddServicesService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private categoryService: CategoryService,
  ) { }

  ngOnInit() {
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoryService.getAllCategories().subscribe((res: any) => {
      this.categories = res;
    });
  }

  selectCategory(event: any) {
    let id = event.target.value;
    let selectedCategory = this.categories.find((c: any) => c.id == id);
    if (selectedCategory) {
      this.service.categoryId = selectedCategory.id;
      this.service.categoryName = selectedCategory.name;
    }
  }
  imageUrl: string | null = null;
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitService(form: NgForm) {
    if (form.invalid || !this.selectedFile) {
      this.toastr.warning('Please fill all fields and select an image.');
      return;
    }
    this.spinner.show();
    this.cloudinaryService.uploadImage(this.selectedFile).subscribe(
      (res: any) => {
        this.service.imageUrl = res.secure_url;

        this.serviceService.addService({ ...this.service })
          .then(() => {
            this.spinner.hide();
            this.toastr.success('Service saved successfully!');
            form.reset();
            this.router.navigateByUrl('/admin/update/services');
          })
          .catch((error) => {
            this.spinner.hide();
            this.toastr.error('Error saving service!');
            console.error(error);
          });
      },
      (err: any) => {
        this.spinner.hide();
        this.toastr.error('Image upload failed!');
        console.error(err);
      }
    );
  }
}
