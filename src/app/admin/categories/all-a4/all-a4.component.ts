import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { A4Service } from '../../../services/A4/a4.service';
import { A4 } from '../../../shared/models/A4/a4.model';

@Component({
  selector: 'app-all-a4',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-a4.component.html',
  styleUrls: ['./all-a4.component.css']
})
export class AllA4Component implements OnInit {
  allA4: A4[] = [];

  constructor(
    private a4Service: A4Service,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllA4();
  }

  /** 🔹 Fetch all A4 papers */
  getAllA4() {
    this.a4Service.getActiveA4().subscribe({
      next: (data) => {
        this.allA4 = data;
      },
      error: (err) => console.error('Error fetching A4 papers:', err)
    });
  }

  /** 🔹 Navigate to Edit Page (with confirmation like Manage Category) */
  onEdit(item: A4) {
    if (!item.id) return;

    Swal.fire({
      title: 'Edit A4 Paper?',
      text: `Do you want to edit "${item.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Edit',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/admin/a4papers/edit', item.id]);
      }
    });
  }

  /** 🔹 Delete record with confirmation */
  onDelete(id: string) {
    if (!id) return;

    Swal.fire({
      title: 'Are you sure?',
      text: 'This A4 paper will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.a4Service.deleteA4(id)
          .then(() => {
            Swal.fire('Deleted!', 'A4 Paper deleted successfully!', 'success');
            this.getAllA4();
          })
          .catch((err) => {
            console.error(err);
            this.toastr.error('Delete failed!');
          });
      }
    });
  }
}
