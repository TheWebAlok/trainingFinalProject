import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MuharService } from '../../../services/muhar/muhar.service';
import { Muhar } from '../../../shared/models/muhar/muhar.model';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-muhar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-muhar.component.html',
  styleUrls: ['./edit-muhar.component.css']
})
export class EditMuharComponent implements OnInit {
  muharId: string = '';
  muhar: Muhar = {
    id: '',
    type: '',
    text: '',
    price: 0,
    status: true,
    categoryId: '',
    categoryName: '',
    imageUrl: '',
    createdAt: new Date()
  };

  selectedImage: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private muharService: MuharService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.muharId = this.route.snapshot.paramMap.get('id') || '';
    await this.loadMuharData();
  }

  //Fetch single record
  async loadMuharData() {
    try {
      const data = await this.muharService.getMuharById(this.muharId);
      if (data) {
        this.muhar = data;
        //FIX #1 — fallback if imageUrl is undefined
        this.previewUrl = this.muhar.imageUrl || null;
      } else {
        this.toastr.error('Muhar not found!');
        this.router.navigate(['/admin/all-muhar']);
      }
    } catch (err) {
      console.error(err);
      this.toastr.error('Failed to load Muhar data.');
    } finally {
      this.loading = false;
    }
  }

  //Image Selection & Preview
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedImage = file || null;

    //FIX #2 — check if file exists before reading
    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(this.selectedImage);
    }
  }

  //Update Muhar
  async onUpdate() {
    if (!this.muharId) return;

    const confirmResult = await Swal.fire({
      title: 'Confirm Update',
      text: 'Are you sure you want to update this Muhar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Update',
      cancelButtonText: 'Cancel'
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await this.muharService.updateMuhar(
        this.muharId,
        this.muhar,
        this.selectedImage || undefined
      );
      this.toastr.success('Muhar updated successfully!');
      this.router.navigate(['/admin/all/muhar']);
    } catch (err) {
      console.error(err);
      this.toastr.error('Failed to update Muhar!');
    }
  }
}
