import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../services/category/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  templateUrl: './edit-category.component.html',
  imports: [
    CommonModule,
    FormsModule
  ],
})
export class EditCategoryComponent implements OnInit {

  id!: string;
  selectedFile: File | null = null;

  category: any = {
    name: '',
    company: '',
    price: 0,
    warranty: 0,
    description: '',
    imageUrl: ''
  };

  categories: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private cloudinaryService: CloudinaryService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
        
    this.id = this.route.snapshot.paramMap.get('id') as string;
    
    this.categoryService.getAllCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (err) => {
        console.error("Error loading categories:", err);
        this.toastr.error("Failed to load categories");
      }
    );

    if (this.id) {
      this.categoryService.getSingleCategory(this.id)
        .then((cat) => {
          this.category = cat;
        })
        .catch((err) => {
          console.error("Error loading category:", err);
          this.toastr.error("Failed to load category");
        });
    }
  }

  uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async submitCategory(form: any) {
    if (form.invalid) {
      this.toastr.warning("Please fill all required fields");
      return;
    }

    try {
      if (this.selectedFile) {
     
        this.cloudinaryService.uploadImage(this.selectedFile).subscribe(
          async (res: any) => {
            this.category.imageUrl = res.secure_url;

            await this.categoryService.updateCategory(this.id, this.category);

            this.toastr.success("Category updated successfully!");
            this.router.navigate(['/admin/category']);
          },
          (err) => {
            console.error("Image upload failed:", err);
            this.toastr.error("Image upload failed!");
          }
        );
      } else {
  
        await this.categoryService.updateCategory(this.id, this.category);

        this.toastr.success("Category updated successfully!");
        this.router.navigate(['/admin/category']);
      }
    } catch (err) {
      console.error("Update failed", err);
      this.toastr.error("Update failed!");
    }
  }
}
