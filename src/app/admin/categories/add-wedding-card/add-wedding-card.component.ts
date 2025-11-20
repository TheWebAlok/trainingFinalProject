import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { serverTimestamp } from 'firebase/firestore';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { WeddingCardService } from '../../../services/weddingCard/wedding-card.service';
import { WeddingCard } from '../../../shared/models/weddingCard/wedding-card.model';
import { CategoryService } from '../../../services/category/category.service';
import { Product } from '../../../shared/models/addProduct/add-product.model';

@Component({
  selector: 'app-add-wedding-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-wedding-card.component.html',
  styleUrls: ['./add-wedding-card.component.css']
})
export class AddWeddingCardComponent {
  weddingCard: WeddingCard = {
    id: '',
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    categoryName: '',
    imageUrl: '',
    status: true
  };
  categories: any[] = [];
  productObj: Product = {} as Product;
  selectedFile: File | null = null;

  constructor(
    private cloudinaryService: CloudinaryService,
    private weddingCardService: WeddingCardService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
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
      this.weddingCard.categoryId = selectedCategory.id;
      this.weddingCard.categoryName = selectedCategory.name;
    }
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitWeddingCard(form: NgForm) {
    if (form.invalid || !this.selectedFile) {
      this.toastr.warning('Please fill all fields and select an image.');
      return;
    }

    this.spinner.show();

    this.cloudinaryService.uploadImage(this.selectedFile).subscribe({
      next: (res: any) => {
        const card: WeddingCard = {
          ...this.weddingCard,
          imageUrl: res.secure_url,
          createdAt: serverTimestamp()
        };

        this.weddingCardService.addWeddingCard(card)
          .then(() => {
            this.spinner.hide();
            this.toastr.success('Wedding card added successfully!');
            form.resetForm({
              name: '',
              description: '',
              price: 0,
              status: true
            });
            this.router.navigateByUrl('/admin/update/category');
          })
          .catch((error) => {
            this.spinner.hide();
            this.toastr.error('Error saving wedding card!');
            console.error(error);
          });
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error('Image upload failed!');
        console.error(err);
      }
    });
  }
}
