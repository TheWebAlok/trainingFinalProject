import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { A4 } from '../../../shared/models/A4/a4.model';
import { A4Service } from '../../../services/A4/a4.service';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { CategoryService } from '../../../services/category/category.service';

@Component({
  selector: 'app-add-a4',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-a4.component.html',
  styleUrls: ['./add-a4.component.css']
})
export class AddA4Component implements OnInit {
  a4: A4 = {
    name: '',
    gsm: 0,
    price: 0,
    packSize: 0,
    stock: 0,
    imageUrl: '',
    description: '',
    status: true,
    categoryId: '',
    categoryName: '',
  };


  categories: any[] = [];
  selectedFile: File | null = null;
  uploading = false;

  constructor(
    private a4Service: A4Service,
    private cloudinaryService: CloudinaryService,
    private toastr: ToastrService,
    private categoryService: CategoryService,
  ) { }

  ngOnInit() {
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoryService.getAllCategories().subscribe((res: any) => {
      this.categories = res;
    }, (err) => {
      console.error(err);
      this.toastr.error('Failed to load categories');
    });
  }

  selectCategory(event: any) {
    let id = event.target.value;
    let selectedCategory = this.categories.find((c: any) => c.id == id);
    if (selectedCategory) {
      this.a4.categoryId = selectedCategory.id;
      this.a4.categoryName = selectedCategory.name;
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }


  addA4(a4Form: any) {
    this.uploading = true;

    if (this.selectedFile) {
      this.cloudinaryService.uploadImage(this.selectedFile).subscribe((res: any) => {
        this.a4.imageUrl = res.secure_url;

        this.a4Service.addA4(this.a4).then(() => {
          this.toastr.success('A4 Paper added successfully!');
          this.resetForm(a4Form);
        }).catch(err => {
          console.error(err);
          this.toastr.error('Failed to save A4 Paper!');
        }).finally(() => {
          this.uploading = false;
        });

      }, (err) => {
        console.error(err);
        this.toastr.error('Image upload failed!');
        this.uploading = false;
      });

    } else {
      this.a4Service.addA4(this.a4).then(() => {
        this.toastr.success('A4 Paper added successfully!');
        this.resetForm(a4Form);
      }).catch(err => {
        console.error(err);
        this.toastr.error('Failed to save A4 Paper!');
      }).finally(() => {
        this.uploading = false;
      });
    }
  }

  private resetForm(a4Form: any) {
    a4Form.resetForm();
    this.a4 = {
      name: '',
      gsm: 0,
      price: 0,
      packSize: 0,
      stock: 0,
      imageUrl: '',
      description: '',
      status: true,
      categoryId: '',
      categoryName: ''

    };
    this.selectedFile = null;
  }
}
