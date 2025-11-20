import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category/category.service';
import { Category } from '../../../shared/models/category/category.model';
import { AddProductService } from '../../../services/addProduct/add-product.service';
import { Product } from '../../../shared/models/addProduct/add-product.model';
import { AddServicesService } from '../../../services/services/services.service';
import { Services } from '../../../shared/models/services/services.model';
import { WeddingCard } from '../../../shared/models/weddingCard/wedding-card.model';
import { WeddingCardService } from '../../../services/weddingCard/wedding-card.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-category',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit {
  categories: Category[] = [];
  products: Product[] = [];
  servicesList: Services[] = [];
  weddingCardsList: WeddingCard[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private productService: AddProductService,
    private serviceService: AddServicesService,
    private weddingCardService: WeddingCardService
  ) {}

  ngOnInit(){
   
    this.categoryService.getAllCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  onEdit(id?: string) {
    if (!id) return;
    this.router.navigate(['/admin/edit-category', id]);
  }

  deleteCategory(id?: string) {
    if (!id) return;
    Swal.fire({
      title: 'Are you sure?',
      text: 'This category will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService
          .deleteCategory(id)
          .then(() => {
            Swal.fire('Deleted!', 'Category has been deleted.', 'success');
          })
          .catch((err) => console.error(err));
      }
    });
  }
}
