import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Limination } from '../../../shared/models/limination/limination.model';
import { LiminationService } from '../../../services/limination/limination.service';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { CategoryService } from '../../../services/category/category.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-limination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-limination.component.html',
  styleUrls: ['./add-limination.component.css']
})
export class AddLiminationComponent implements OnInit {
  limination: Limination = {
    serviceName: '',
    price: 0,
    image: '',
    status: true,
    description: '',
    categoryId: '',
    categoryName: ''
  };

  categories: any[] = [];
  selectedFile: File | null = null;
  uploading = false;

  constructor(
    private liminationService: LiminationService,
    private cloudinaryService: CloudinaryService,
    private toastr: ToastrService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  // Load all categories
  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => (this.categories = res),
      error: () => this.toastr.error('Failed to load categories')
    });
  }

  // Select category
  selectCategory(event: any) {
    const id = event.target.value;
    const cat = this.categories.find((c: any) => c.id === id);
    if (cat) {
      this.limination.categoryId = cat.id;
      this.limination.categoryName = cat.name;
    }
  }

  // Handle file selection
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Submit form
  submitLimination(form: NgForm) {
    if (form.invalid) {
      this.toastr.warning('Please fill all required fields!');
      return;
    }

    if (!this.selectedFile) {
      this.toastr.warning('Please select an image to upload!');
      return;
    }

    this.uploading = true;

    // Upload image to Cloudinary
    this.cloudinaryService.uploadImage(this.selectedFile).subscribe({
      next: (res: any) => {
        this.limination.image = res.secure_url;

        // Save data to Firestore
        this.liminationService.addLimination(this.limination)
          .then(() => {
            this.toastr.success('Lamination service added successfully!');
            this.resetForm(form);
            this.router.navigateByUrl('/admin/all/Lamination');
          })
          .catch((err) => {
            console.error(err);
            this.toastr.error('Failed to add lamination service!');
          })
          .finally(() => {
            this.uploading = false;
          });
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Image upload failed!');
        this.uploading = false;
      }
    });
  }

  // Reset form
  private resetForm(form: NgForm) {
    form.resetForm();
    this.selectedFile = null;
    this.limination = {
      serviceName: '',
      price: 0,
      image: '',
      status: true,
      description: '',
      categoryId: '',
      categoryName: ''
    };
  }
}
