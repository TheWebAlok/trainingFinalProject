import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MuharService } from '../../../services/muhar/muhar.service';
import { Muhar } from '../../../shared/models/muhar/muhar.model';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-muhar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './all-muhar.component.html',
  styleUrls: ['./all-muhar.component.css']
})
export class AllMuharComponent implements OnInit {
  muhars: Muhar[] = [];
  loading = true;

  constructor(private muharService: MuharService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadMuhars();
  }

  loadMuhars() {
    this.muharService.getAllMuhars().subscribe({
      next: (data) => {
        this.muhars = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to load muhar data.');
        this.loading = false;
      }
    });
  }

  deleteMuhar(id: string | undefined) {
    if (!id) return;

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Muhar!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.muharService.deleteMuhar(id)
          .then(() => {
            this.toastr.success('Deleted successfully!');
            this.loadMuhars();
          })
          .catch(() => this.toastr.error('Failed to delete!'));
      }
    });
  }
}
