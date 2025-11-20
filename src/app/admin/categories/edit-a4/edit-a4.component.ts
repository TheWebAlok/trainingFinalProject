import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { A4Service } from '../../../services/A4/a4.service';
import { A4 } from '../../../shared/models/A4/a4.model';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';

@Component({
  selector: 'app-edit-a4',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-a4.component.html',
  styleUrls: ['./edit-a4.component.css']
})
export class EditA4Component implements OnInit {

  a4Data: A4 = {
    name: '',
    gsm: 0,
    price: 0,
    packSize: 0,
    stock: 0,
    description: '',
    imageUrl: '',
    status: true,
    categoryId: '',
    categoryName: '',
    createdAt: new Date()
  };

  id: string = '';
  selectedFile: File | null = null;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private a4Service: A4Service,
    private cloudinaryService: CloudinaryService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.a4Service.getA4ById(this.id).subscribe((data: A4) => {
        if (data) {
          this.a4Data = { ...data };
        }
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpdate() {
    if (!this.id) return;
    this.loading = true;

    if (this.selectedFile) {
      this.cloudinaryService.uploadImage(this.selectedFile).subscribe({
        next: (res: any) => {
          this.a4Data.imageUrl = res.secure_url;
          this.updateFirestore();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Image upload failed!');
          this.loading = false;
        }
      });
    } else {
      this.updateFirestore();
    }
  }

  private updateFirestore() {
    this.a4Service.updateA4(this.id, this.a4Data).then(() => {
      this.toastr.success('A4 Paper updated successfully!');
      this.router.navigate(['/all/A4']);
    }).catch(err => {
      console.error(err);
      this.toastr.error('Update failed!');
    }).finally(() => {
      this.loading = false;
    });
  }

}
