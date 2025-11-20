import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { LiminationService } from '../../../services/limination/limination.service';
import { Limination } from '../../../shared/models/limination/limination.model';

@Component({
  selector: 'app-all-lamination',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './all-lamination.component.html',
  styleUrls: ['./all-lamination.component.css']
})
export class AllLaminationComponent implements OnInit {
  laminations: Limination[] = [];
  loading = true;

  constructor(
    private liminationService: LiminationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllLaminations();
  }

  // Fetch all lamination services
  getAllLaminations() {
    this.liminationService.getAllLimination().subscribe({
      next: (res) => {
        this.laminations = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching laminations:', err);
        this.toastr.error('Failed to load lamination services!');
        this.loading = false;
      },
    });
  }

  // Delete Function with confirmation
  onDelete(id: string) {
    if (!id) return;

    Swal.fire({
      title: 'Are you sure?',
      text: 'This lamination service will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.liminationService.deleteLimination(id)
          .then(() => {
            this.toastr.success('Lamination service deleted successfully!');
            this.getAllLaminations(); // Refresh the list
          })
          .catch((err) => {
            console.error(err);
            this.toastr.error('Failed to delete lamination service!');
          });
      }
    });
  }
}
