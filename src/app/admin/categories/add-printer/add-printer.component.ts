import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { PrinterService } from '../../../services/printer/printer.service';
import { Printer } from '../../../shared/models/printer/printer.model';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../services/category/category.service';

@Component({
  selector: 'app-add-printer',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-printer.component.html',
  styleUrls: ['./add-printer.component.css']
})
export class AddPrinterComponent {
  categories: any[] = [];
  
  printerObj: Printer = {} as Printer;
  selectedFile: File | null = null;

  constructor(
    private cloudinaryService: CloudinaryService,
    private printerService: PrinterService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
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
      this.printerObj.categoryId = selectedCategory.id;
      this.printerObj.categoryName = selectedCategory.name;
    }
  }
  uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitPrinter(form: NgForm) {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Please upload an image.', 'error');
      return;
    }

    if (form.invalid) {
      this.toastr.error('Please fill all required fields');
      return;
    }

    this.spinner.show();

    this.cloudinaryService.uploadImage(this.selectedFile).subscribe((res: any) => {
      this.printerObj.imageUrl = res.secure_url;
      this.printerObj.createdAt = Date.now();

      this.printerService.addPrinter(this.printerObj)
        .then(() => {
          this.spinner.hide();
          this.toastr.success('Printer saved successfully!');
          form.resetForm();
          this.selectedFile = null;
          this.router.navigateByUrl('/admin/update/category');
        })
        .catch((err: any) => {
          this.spinner.hide();
          this.toastr.error('Error saving printer!');
          console.error(err);
        });
    }, (err: any) => {
      this.spinner.hide();
      this.toastr.error('Image upload failed!');
      console.error(err);
    });
  }
}
