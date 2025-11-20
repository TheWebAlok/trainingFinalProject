import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Mouse } from '../../../shared/models/mouse/mouse.model';
import { MouseService } from '../../../services/mouse/mouse.service';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { CategoryService } from '../../../services/category/category.service';

@Component({
  selector: 'app-addmouse',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './addmouse.component.html',
  styleUrls: ['./addmouse.component.css']
})
export class AddmouseComponent {
  mouse: Mouse = {
    name: '',
    brand: '',
    type: 'wired',
    price: 0,
    stock: 0,
    status: true,
    createdAt: new Date(),
    description: '',
    categoryId: '',
    categoryName: '',
  };

  categories: any[] = [];
  selectedFile: File | null = null;
  uploading: boolean = false;

  constructor(
    private mouseService: MouseService,
    private cloudinary: CloudinaryService,
    private toastr: ToastrService,
    private categoryService: CategoryService
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
      this.mouse.categoryId = selectedCategory.id;
      this.mouse.categoryName = selectedCategory.name;
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addMouse() {
    if (this.selectedFile) {
      this.uploading = true;
      this.cloudinary.uploadImage(this.selectedFile).subscribe(
        (res: any) => {
          this.mouse.imageUrl = res.secure_url;
          this.saveMouse();
        },
        (err) => {
          this.uploading = false;
          this.toastr.error('Image upload failed!');
          console.error(err);
        }
      );
    } else {
      this.saveMouse();
    }
  }

  private saveMouse() {
    this.mouseService.addMouse(this.mouse).then(() => {
      this.uploading = false;
      this.toastr.success('Mouse added successfully!');
      this.mouse = {
        name: '',
        brand: '',
        type: 'wired',
        price: 0,
        stock: 0,
        status: true,

        description: '',
        categoryId: '',
        categoryName: ''
      };
      this.selectedFile = null;
    }).catch(() => {
      this.uploading = false;
      this.toastr.error('Failed to add mouse!');
    });
  }
}
