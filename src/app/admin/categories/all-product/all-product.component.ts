import { Component, OnInit } from '@angular/core';
import { Product } from '../../../shared/models/addProduct/add-product.model';
import { Router, RouterLink } from '@angular/router';
import { AddProductService } from '../../../services/addProduct/add-product.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-product',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.css']
})
export class AllProductComponent implements OnInit {

  products: Product[] = [];
  loading: boolean = true;

  constructor(
    private router: Router,
    private productService: AddProductService,
  ) { }

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.loading = false;
      }
    );
  }

  getProductsByCategory(categoryId: string): Product[] {
    return this.products.filter(p => p.categoryId === categoryId);
  }

  deleteProduct(id?: string) {
    if (!id) return;

    Swal.fire({
      title: 'Are you sure?',
      text: 'This product will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).then(() => {
          Swal.fire('Deleted!', 'Product has been deleted.', 'success');
          this.getAllProducts();
        }).catch((err) => {
          console.error(err);
          Swal.fire('Error!', 'Failed to delete product.', 'error');
        });
      }
    });
  }

}
