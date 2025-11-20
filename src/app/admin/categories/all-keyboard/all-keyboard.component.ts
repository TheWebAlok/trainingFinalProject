import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { KeyboardService } from '../../../services/keyboard/keyboard.service';
import { Keyboard } from '../../../shared/models/keyboard/keyboard.model';

@Component({
  selector: 'app-all-keyboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './all-keyboard.component.html',
  styleUrls: ['./all-keyboard.component.css']
})
export class AllKeyboardComponent implements OnInit {
  keyboards: Keyboard[] = [];

  constructor(
    private keyboardService: KeyboardService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllKeyboards();
  }

  /** Fetch all keyboards */
  getAllKeyboards(): void {
    this.keyboardService.getKeyboards().subscribe({
      next: (data: Keyboard[]) => this.keyboards = data,
      error: (err: any) => console.error('Error fetching keyboards:', err)
    });
  }

  /** Navigate to edit page */
  onEdit(id: string): void {
    this.router.navigate(['/admin/keyboards/edit', id]);
  }

  /** Delete keyboard */
  onDelete(id: string): void {
    if (!id) return;

    Swal.fire({
      title: 'Are you sure?',
      text: 'This keyboard will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.keyboardService.deleteKeyboard(id)
          .then(() => {
            this.toastr.success('Keyboard deleted successfully!');
            this.getAllKeyboards();
          })
          .catch((err) => {
            console.error(err);
            this.toastr.error('Failed to delete keyboard!');
          });
      }
    });
  }

  /** For performance in *ngFor */
  trackById(index: number, item: Keyboard): string {
    return item.id || index.toString();
  }
}
