import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { AddProductService } from '../../../services/addProduct/add-product.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgxSpinnerModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  id!: string;
  productForm!: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private addProductService: AddProductService,
    private cloudinaryService: CloudinaryService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id") || '';
    this.initForm();

    if (this.id) {
      this.getAllProduct();
    }
  }

  // Reactive Form initialization
  initForm() {
    this.productForm = this.fb.group({
      name: [''],
      brand: [''],
      price: [0],
      stock: [0],
      categoryId: [''],
      categoryName: [''],
      description: [''],
      imageUrl: [''],
      status: [true]
    });
  }


  getAllProduct() {
    this.addProductService.getSingleProduct(this.id)
      .then((product) => {
        if (product) {
          this.productForm.patchValue(product);
        } else {
          this.toastr.error("Product not found");
        }
      })
      .catch((err) => {
        console.error("Error loading product:", err);
        this.toastr.error("Failed to load product");
      });
  }

  uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitProduct() {
    if (this.productForm.invalid) {
      this.toastr.warning("Please fill all required fields");
      return;
    }

    this.spinner.show();
    const formData = this.productForm.value;

    const updateProductData = async (imageUrl?: string) => {
      if (imageUrl) formData.imageUrl = imageUrl;

      try {
        await this.addProductService.updateProduct(this.id, formData);
        this.spinner.hide();
        this.toastr.success("Product updated successfully");
        this.router.navigateByUrl("/admin/update/category");
      } catch (err) {
        this.spinner.hide();
        console.error("Update error:", err);
        this.toastr.error("Product update failed");
      }
    };

    if (this.selectedFile) {
      this.cloudinaryService.uploadImage(this.selectedFile).subscribe(
        (res: any) => updateProductData(res.secure_url),
        (err: any) => {
          this.spinner.hide();
          console.error("Upload error:", err);
          this.toastr.error("Image upload failed");
        }
      );
    } else {
      updateProductData();
    }
  }
}
