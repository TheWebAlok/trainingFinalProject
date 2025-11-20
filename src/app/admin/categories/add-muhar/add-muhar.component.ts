import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MuharService } from '../../../services/muhar/muhar.service';
import { CategoryService } from '../../../services/category/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-muhar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-muhar.component.html',
  styleUrls: ['./add-muhar.component.css']
})
export class AddMuharComponent implements OnInit {

  muhar = {
    type: '',
    text: '',
    price: 0,
    status: true,
    categoryId: '',
    categoryName: '',
    imageUrl: ''
  };

  categories: any[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private muharService: MuharService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe((res: any) => {
      this.categories = res;
    });
  }

  onCategoryChange(event: any) {
    const id = event.target.value;
    const selected = this.categories.find((c: any) => c.id === id);
    if (selected) {
      this.muhar.categoryId = selected.id;
      this.muhar.categoryName = selected.name;
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    // simple image preview
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async onSubmit() {
    try {
      await this.muharService.addMuhar(this.muhar, this.selectedFile || undefined);
      this.toastr.success('Muhar added successfully!');
      this.resetForm();
    } catch (error) {
      console.error(error);
      this.toastr.error('Error adding muhar!');
    }
  }

  resetForm() {
    this.muhar = {
      type: '',
      text: '',
      price: 0,
      status: true,
      categoryId: '',
      categoryName: '',
      imageUrl: ''
    };
    this.selectedFile = null;
    this.imagePreview = null;
  }
}
