import { Component, OnInit } from '@angular/core';
import { A4 } from '../../shared/models/A4/a4.model';
import { A4Service } from '../../services/A4/a4.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { Printer } from '../../shared/models/printer/printer.model';
import { PrinterService } from '../../services/printer/printer.service';
import { Keyboard } from '../../shared/models/keyboard/keyboard.model';
import { KeyboardService } from '../../services/keyboard/keyboard.service';
import { MouseService } from '../../services/mouse/mouse.service';
import { Muhar } from '../../shared/models/muhar/muhar.model';
import { MuharService } from '../../services/muhar/muhar.service';
import { LiminationService } from '../../services/limination/limination.service';
import { Limination } from '../../shared/models/limination/limination.model';
import { Services } from '../../shared/models/services/services.model';
import { AddServicesService } from '../../services/services/services.service';
import { WeddingCard } from '../../shared/models/weddingCard/wedding-card.model';
import { WeddingCardService } from '../../services/weddingCard/wedding-card.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loading = true;
  allA4: A4[] = [];
  mice: any[] = [];
  muhars: Muhar[] = [];
  printers: Printer[] = [];
  keyboards: Keyboard[] = [];
  servicesList: Services[] = [];
  laminations: Limination[] = [];
  weddingCardsList: WeddingCard[] = [];
    


  constructor(
    private router: Router,
    private a4Service: A4Service,
    private toastr: ToastrService,
    private mouseService: MouseService,
    private muharService: MuharService,
    private printerService: PrinterService,
    private keyboardService: KeyboardService,
    private serviceService: AddServicesService,
    private liminationService: LiminationService,
    private weddingCardService: WeddingCardService,
        
  ) { }
  

  ngOnInit() {
    this.getAllA4();
    this.getAllMice();
    this.loadMuhars();
    this.getServices();
    this.loadPrinters();
    this.getAllKeyboards();
    this.getAllWeddingCards()
    this.getAllLaminations();
        
  }
 getAllWeddingCards(): void {  // ✅ class member function
    this.weddingCardService.getAllWeddingCards().subscribe(
      (cards: WeddingCard[]) => {
        this.weddingCardsList = cards;
      },
      (err) => {
        console.error('Wedding Cards load error:', err);
      }
    );
  }

  getServices() {
    this.serviceService.getAllServices().subscribe(
      (services: Services[]) => {
        this.servicesList = services.filter(s => s.status === true);
      },
      (err) => {
        console.error("Services load error:", err);
      }
    );
  }
  getAllLaminations() {
    this.liminationService.getAllLimination().subscribe({
      next: (res) => {
        this.laminations = res;
        this.loading = false;
      },
      error: (err) => {
        console.error("Error fetching laminations:", err);
        this.toastr.error("Failed to load lamination services!");
        this.loading = false;
      },
    });
  }
  loadMuhars() {
    this.muharService.getAllMuhars().subscribe({
      next: (data) => {
        this.muhars = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error("Failed to load Muhar data.");
        this.loading = false;
      }
    });
  }
  getAllKeyboards(): void {
    this.keyboardService.getKeyboards().subscribe({
      next: (data: Keyboard[]) => this.keyboards = data,
      error: (err: any) => console.error('Error fetching keyboards:', err)
    });
  }
  getAllA4() {
    this.a4Service.getActiveA4().subscribe(data => {
      this.allA4 = data;
    });
  }


  loadPrinters() {
    this.printerService.getPrinters().subscribe({
      next: (res: Printer[]) => {
        this.printers = res;
      },
      error: (err: any) => {
        console.error(err);
        this.toastr.error('Failed to load printers');
      }
    });
  }

  getAllMice() {

    this.mouseService.getAllMice().subscribe({
      next: (res: any) => {
        this.mice = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching mice:', err);
        this.toastr.error("Failed to load mouse data");
        this.loading = false;
      }
    });
  }

}
