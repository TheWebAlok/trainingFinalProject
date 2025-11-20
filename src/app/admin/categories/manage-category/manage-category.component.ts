import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category/category.service';
import { Category } from '../../../shared/models/category/category.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-category',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.css']
})
export class ManageCategoryComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data.filter(c => c.status === true);
      },
      error: (err) => console.error('Error fetching categories:', err)
    });
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

  trackById(index: number, item: Category): string {
    return item.id || index.toString();
  }
}
