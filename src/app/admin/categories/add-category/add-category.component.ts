import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Category } from '../../../shared/models/category/category.model';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../../services/category/category.service';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent {
  category: Category = {
    name: '',
    company: '',
    price: 0,
    warranty: 0,
    description: '',
    imageUrl: '',
    status: true,
    createdAt: Date.now()
  };

  selectedFile: File | null = null;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private categoryService: CategoryService,
    private cloudinaryService: CloudinaryService
  ) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitCategory(form: NgForm) {
    if (form.invalid) {
      this.toastr.error("Please fill all fields!");
      return;
    }

    if (!this.selectedFile) {
      this.toastr.error("Please select an image!");
      return;
    }


    this.cloudinaryService.uploadImage(this.selectedFile).subscribe(
      (res: any) => {
        this.category.imageUrl = res.secure_url;
        this.categoryService.addCategory(this.category)
          .then(() => {
            this.toastr.success("Category Added Successfully");

            
            this.router.navigate(['/admin/manage-category']);

            form.reset();
            this.selectedFile = null;
          })
          .catch((err) => {
            console.error("Error saving category:", err);
            this.toastr.error("Failed to add category");
          });
      },
      (err) => {
        console.error("Image upload failed:", err);
        this.toastr.error("Image upload failed!");
      }
    );
  }

  }
