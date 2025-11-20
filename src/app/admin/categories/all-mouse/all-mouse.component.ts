import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MouseService } from '../../../services/mouse/mouse.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-mouse',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-mouse.component.html',
  styleUrls: ['./all-mouse.component.css']
})
export class AllMouseComponent implements OnInit {
  mice: any[] = [];
  loading = true;

  constructor(
    private mouseService: MouseService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllMice();
  }

  getAllMice() {
    this.mouseService.getAllMice().subscribe({
      next: (res: any) => {
        this.mice = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching mice:', err);
        this.loading = false;
      }
    });
  }

  editMouse(id: string) {
    this.router.navigate(['/admin/edit-mouse', id]);
  }

  deleteMouse(id: string) {
    if (confirm('Are you sure you want to delete this mouse?')) {
      this.mouseService.deleteMouse(id)
        .then(() => {
          this.toastr.success('Mouse deleted successfully!');
        })
        .catch((err) => {
          this.toastr.error('Failed to delete mouse!');
          console.error(err);
        });
    }
  }
}
