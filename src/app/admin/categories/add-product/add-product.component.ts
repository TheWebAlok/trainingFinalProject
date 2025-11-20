import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductService } from '../../../services/addProduct/add-product.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { Product } from '../../../shared/models/addProduct/add-product.model';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category/category.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgxSpinnerModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private addProductService: AddProductService,
    private categoryService: CategoryService,
    private cloudinaryService: CloudinaryService,
    private spinner: NgxSpinnerService
  ) { }

  productObj: Product = {} as Product;
  categories: any[] = [];
  selectedFile: File | null = null;
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
      this.productObj.categoryId = selectedCategory.id;
      this.productObj.categoryName = selectedCategory.name;
    }
  }

  uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitProduct() {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Please upload an image.', 'error');
      return;
    }

    this.spinner.show();

    this.cloudinaryService.uploadImage(this.selectedFile).subscribe((res: any) => {
      this.productObj.imageUrl = res.secure_url;
      this.productObj.createdAt = Date.now();
      this.productObj.status = true;

      this.addProductService.addProduct(this.productObj)
        .then(() => {
          this.spinner.hide();
          this.toastr.success('Product saved successfully!');
          this.productObj = {} as Product;
          this.selectedFile = null;
          this.router.navigateByUrl('/admin/update/category');
        })
        .catch((err: any) => {
          this.spinner.hide();
          this.toastr.error('Error saving product!');
          console.error(err);
        });
    }, (err: any) => {
      this.spinner.hide();
      this.toastr.error('Image upload failed!');
      console.error(err);
    });
  }

}
