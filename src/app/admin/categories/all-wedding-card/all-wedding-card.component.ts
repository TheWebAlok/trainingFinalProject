import { Component, OnInit } from '@angular/core';
import { WeddingCard } from '../../../shared/models/weddingCard/wedding-card.model';
import { Router } from '@angular/router';
import { WeddingCardService } from '../../../services/weddingCard/wedding-card.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-wedding-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-wedding-card.component.html',
  styleUrls: ['./all-wedding-card.component.css']
})
export class AllWeddingCardComponent implements OnInit {
  weddingCardsList: WeddingCard[] = [];

  constructor(
    private router: Router,
    private weddingCardService: WeddingCardService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getAllWeddingCards();
  }

  getAllWeddingCards() {
    this.spinner.show();
    this.weddingCardService.getAllWeddingCards().subscribe({
      next: (data) => {
        this.weddingCardsList = data;
        this.spinner.hide();
        this.toastr.success('Wedding cards loaded successfully!');
      },
      error: (err) => {
        console.error('Error fetching wedding cards:', err);
        this.spinner.hide();
        this.toastr.error('Failed to load wedding cards.');
      }
    });
  }

  editWeddingCard(id?: string) {
    if (!id) return;
    this.router.navigate(['/admin/edit-wedding/card', id]);
  }

  deleteWeddingCard(id?: string) {
    if (!id) return;
    Swal.fire({
      title: 'Are you sure?',
      text: 'This wedding card will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.weddingCardService.deleteWeddingCard(id)
          .then(() => {
            this.weddingCardsList = this.weddingCardsList.filter(card => card.id !== id);
            this.spinner.hide();
            Swal.fire('Deleted!', 'Wedding card has been deleted.', 'success');
          })
          .catch((err) => {
            console.error(err);
            this.spinner.hide();
            Swal.fire('Error!', 'Failed to delete wedding card.', 'error');
          });
      }
    });
  }
}
