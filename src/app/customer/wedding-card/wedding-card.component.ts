import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { WeddingCard } from '../../shared/models/weddingCard/wedding-card.model';
import { WeddingCardService } from '../../services/weddingCard/wedding-card.service';
import { CartModel } from '../../shared/models/cart/cart.model';
import { CartService } from '../../services/cart/cart.service';
import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'app-wedding-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wedding-card.component.html',
  styleUrls: ['./wedding-card.component.css']
})
export class WeddingCardComponent implements OnInit {
  weddingCardsList: WeddingCard[] = [];
  userLoggedIn: boolean = false;
  
  constructor(
    private weddingCardService: WeddingCardService,
    private cartService: CartService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userLoggedIn = this.authService.getIsLoggedIn();

    this.weddingCardService.getAllWeddingCards().subscribe(
      cards => {
        this.weddingCardsList = cards.map(c => {
          if ((c as any).createdAt && (c as any).createdAt.toDate) {
            return { ...c, createdAt: (c as any).createdAt.toDate() };
          }
          return c;
        });
      },
      err => console.error('Error fetching wedding cards:', err)
    );
  }
  
  orderNow(card: WeddingCard) {
  if (!this.userLoggedIn) {
    this.toastr.error("Please First login, Thank You");
    this.router.navigate(['/login']);
    return;
  }

  this.router.navigate(['/orders', card.id], { state: { card } });
}

}


