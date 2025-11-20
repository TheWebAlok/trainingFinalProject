import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { KeyboardService } from '../../../services/keyboard/keyboard.service';
import { Keyboard } from '../../../shared/models/keyboard/keyboard.model';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../services/category/category.service';
import { Product } from '../../../shared/models/addProduct/add-product.model';
import { AddProductService } from '../../../services/addProduct/add-product.service';

@Component({
  selector: 'app-add-keyboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-keyboard.component.html',
  styleUrls: ['./add-keyboard.component.css']
})
export class AddKeyboardComponent {
  keyboardObj: Keyboard = {} as Keyboard;
  selectedFile: File | null = null;
  categories: any[] = [];
  productObj: Product = {} as Product;

  addKeyboard: Keyboard={
          id:'',
    name: '',
    brand: '',
    type: 'wired',
    price: 0,
    description: '',
    imageUrl: '',
    stock: 0,
    createdAt: Date,
    categoryId: '',
    categoryName: '',

  }
  constructor(
    private cloudinaryService: CloudinaryService,
    private keyboardService: KeyboardService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private addProductService: AddProductService,

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
  uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
  }

  selectCategory(event: any) {
    let id = event.target.value;
    let selectedCategory = this.categories.find((c: any) => c.id == id);
    if (selectedCategory) {
      this.addKeyboard.categoryId = selectedCategory.id;
      this.addKeyboard.categoryName = selectedCategory.name;
    }
  }

  submitKeyboard(form: NgForm) {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Please upload an image.', 'error');
      return;
    }

    if (form.invalid) {
      this.toastr.error('Please fill all required fields');
      return;
    }

    this.spinner.show();

    this.cloudinaryService.uploadImage(this.selectedFile).subscribe(
      (res: any) => {
        this.keyboardObj.imageUrl = res.secure_url;
        this.keyboardObj.createdAt = Date.now();

        this.keyboardService.addKeyboard(this.keyboardObj)
          .then(() => {
            this.spinner.hide();
            this.toastr.success('Keyboard saved successfully!');
            form.resetForm();
            this.selectedFile = null;
            this.router.navigateByUrl('/admin/update/category');
          })
          .catch((err: any) => {
            this.spinner.hide();
            this.toastr.error('Error saving keyboard!');
            console.error(err);
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
