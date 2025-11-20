import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { serverTimestamp } from 'firebase/firestore';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { WeddingCardService } from '../../../services/weddingCard/wedding-card.service';
import { WeddingCard } from '../../../shared/models/weddingCard/wedding-card.model';

@Component({
  selector: 'app-edit-wedding-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-wedding-card.component.html',
  styleUrls: ['./edit-wedding-card.component.css']
})
export class EditWeddingCardComponent implements OnInit {
  cardForm!: FormGroup;
  selectedFile: File | null = null;
  cardId!: string;
  oldImageUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cloudinaryService: CloudinaryService,
    private weddingCardService: WeddingCardService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.cardForm = this.fb.group({
      name: [''],
      description: [''],
      price: [0],
    });

    this.cardId = this.route.snapshot.paramMap.get('id') as string;

    if (this.cardId) {
      this.loadCardData();
    }
  }

  loadCardData() {
    this.spinner.show();
    this.weddingCardService.getSingleWeddingCard(this.cardId)
      .then((card: WeddingCard) => {
        if (card) {
          this.cardForm.patchValue({
            name: card.name,
            description: card.description,
            price: card.price
          });
          this.oldImageUrl = card.imageUrl || '';
        }
        this.spinner.hide();
      })
      .catch(err => {
        this.toastr.error('Failed to load wedding card details');
        console.error(err);
        this.spinner.hide();
      });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  updateCard() {
    this.spinner.show();

    const updateData = (imageUrl: string) => {
      const updatedCard: Partial<WeddingCard> = {
        ...this.cardForm.value,
        imageUrl: imageUrl,
        updatedAt: serverTimestamp()
      };

      this.weddingCardService.updateWeddingCard(this.cardId, updatedCard)
        .then(() => {
          this.spinner.hide();
          this.toastr.success('Wedding card updated successfully!');
          this.router.navigateByUrl('/admin/update/category');
        })
        .catch(err => {
          this.spinner.hide();
          this.toastr.error('Error updating wedding card!');
          console.error(err);
        });
    };

    if (this.selectedFile) {
      this.cloudinaryService.uploadImage(this.selectedFile).subscribe({
        next: (res: any) => updateData(res.secure_url),
        error: (err) => {
          this.spinner.hide();
          this.toastr.error('Image upload failed!');
          console.error(err);
        }
      });
    } else {
      updateData(this.oldImageUrl);
    }
  }
}
