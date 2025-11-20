import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LiminationService } from '../../../services/limination/limination.service';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { Limination } from '../../../shared/models/limination/limination.model';

@Component({
  selector: 'app-edit-lamination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-lamination.component.html',
  styleUrls: ['./edit-lamination.component.css']
})
export class EditLaminationComponent implements OnInit {
  laminationId: string = '';
  lamination: Limination = {
    serviceName: '',
    price: 0,
    image: '',
    status: true,
    description: '',
    categoryId: '',
    categoryName: ''
  };
  loading = true;
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private liminationService: LiminationService,
    private cloudinaryService: CloudinaryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.laminationId = this.route.snapshot.paramMap.get('id') || '';
    if (this.laminationId) {
      this.loadLamination(this.laminationId);
    } else {
      this.loading = false;
    }
  }

  /** Load lamination details by ID */
  async loadLamination(id: string) {
    try {
      const res = await this.liminationService.getLiminationById(id);
      if (res) {
        this.lamination = res;
      } else {
        this.toastr.warning('Lamination not found');
        this.router.navigate(['/admin/lamination']);
      }
    } catch (err) {
      console.error(err);
      this.toastr.error('Error loading lamination');
      this.router.navigate(['/admin/lamination']);
    } finally {
      this.loading = false;
    }
  }

  /** Handle file selection */
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  /** Update lamination (with optional image upload) */
  updateLamination(form: NgForm) {
    if (form.invalid) {
      this.toastr.error('Please fill all required fields');
      return;
    }

    const updateAction = () => {
      this.liminationService.updateLimination(this.laminationId, this.lamination)
        .then(() => {
          this.toastr.success('Lamination updated successfully!');
          this.router.navigate(['/admin/all/Lamination']);
        })
        .catch((err) => {
          console.error(err);
          this.toastr.error('Update failed!');
        });
    };

    if (this.selectedFile) {
      this.cloudinaryService.uploadImage(this.selectedFile).subscribe({
        next: (res: any) => {
          this.lamination.image = res.secure_url;
          updateAction();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Image upload failed!');
        }
      });
    } else {
      updateAction();
    }
  }

  /** Cancel and go back */
  cancel() {
    this.router.navigate(['/admin/all/Lamination']);
  }
}
