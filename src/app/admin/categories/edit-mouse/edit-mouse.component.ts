import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MouseService } from '../../../services/mouse/mouse.service';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';

@Component({
  selector: 'app-edit-mouse',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-mouse.component.html',
  styleUrls: ['./edit-mouse.component.css']
})
export class EditMouseComponent implements OnInit {
  id: string = '';
  mouse: any = {};
  selectedFile: File | null = null;
  loading = true;
  uploading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mouseService: MouseService,
    private cloudinary: CloudinaryService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.loadMouse();
  }

  loadMouse() {
    this.mouseService.getAllMice().subscribe((mice) => {
      const found = mice.find((m: any) => m.id === this.id);
      if (found) {
        this.mouse = { ...found };
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  updateMouse() {
    this.uploading = true;

    // if image selected, upload new image first
    if (this.selectedFile) {
      this.cloudinary.uploadImage(this.selectedFile).subscribe({
        next: (res: any) => {
          this.mouse.imageUrl = res.secure_url;
          this.updateMouseInFirebase();
        },
        error: (err) => {
          this.uploading = false;
          this.toastr.error('Image upload failed!');
          console.error(err);
        }
      });
    } else {
      // no new image selected → just update data
      this.updateMouseInFirebase();
    }
  }

  private updateMouseInFirebase() {
    this.mouseService.updateMouse(this.id, this.mouse)
      .then(() => {
        this.uploading = false;
        this.toastr.success('Mouse updated successfully!');
        this.router.navigate(['/admin/all/mouse']);
      })
      .catch((err) => {
        this.uploading = false;
        this.toastr.error('Failed to update mouse!');
        console.error(err);
      });
  }
}
