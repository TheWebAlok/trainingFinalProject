import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { CustomerLayoutComponent } from './customer/customer-layout/customer-layout.component';
import { HomeComponent } from './customer/home/home.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { CategoriesComponent } from './admin/categories/categories.component';
import { AddCategoryComponent } from './admin/categories/add-category/add-category.component';
import { UpdateCategoryComponent } from './admin/categories/update-category/update-category.component';
import { RegisterComponent } from './register/register.component';
import { ContactComponent } from './customer/contact/contact.component';
import { CartComponent } from './customer/cart/cart.component';
import { BillingsComponent } from './customer/billings/billings.component';
import { TestimonialComponent } from './customer/testimonial/testimonial.component';
import { ErrorComponent } from './customer/error/error.component';
import { userGuard } from './shared/guard/user/user.guard';
import { EditCategoryComponent } from './admin/categories/edit-category/edit-category.component';
import { ProductComponent } from './customer/product/product.component';
import { ServicesComponent } from './customer/services/services.component';
import { CategoryComponent } from './customer/category/category.component';
import { AddProductComponent } from './admin/categories/add-product/add-product.component';
import { AddServicesComponent } from './admin/categories/add-services/add-services.component';
import { EditProductComponent } from './admin/categories/edit-product/edit-product.component';
import { EditServicesComponent } from './admin/categories/edit-services/edit-services.component';
import { AddWeddingCardComponent } from './admin/categories/add-wedding-card/add-wedding-card.component';
import { EditWeddingCardComponent } from './admin/categories/edit-wedding-card/edit-wedding-card.component';
import { WeddingCardComponent } from './customer/wedding-card/wedding-card.component';
import { MyAccountComponent } from './customer/my-account/my-account.component';
import { OrdersComponent } from './customer/orders/orders.component';
import { ServiceAppointmentComponent } from './customer/service-appointment/service-appointment.component';
import { AllProductComponent } from './admin/categories/all-product/all-product.component';
import { AllServicesComponent } from './admin/categories/all-services/all-services.component';
import { PaymentComponent } from './customer/payment/payment.component';
import { AllWeddingCardComponent } from './admin/categories/all-wedding-card/all-wedding-card.component';
import { AllOrdersComponent } from './admin/all-orders/all-orders.component';
import { OrderDetailsComponent } from './customer/order-details/order-details.component';
import { AddKeyboardComponent } from './admin/categories/add-keyboard/add-keyboard.component';
import { AddMuharComponent } from './admin/categories/add-muhar/add-muhar.component';
import { AddmouseComponent } from './admin/categories/addmouse/addmouse.component';
import { AddA4Component } from './admin/categories/add-a4/add-a4.component';
import { AddPrinterComponent } from './admin/categories/add-printer/add-printer.component';
import { KeyboardComponent } from './customer/keyboard/keyboard.component';
import { PrinterComponent } from './customer/printer/printer.component';
import { MouseComponent } from './customer/mouse/mouse.component';
import { LiminationComponent } from './customer/limination/limination.component';
import { MuharComponent } from './customer/muhar/muhar.component';
import { A4papperComponent } from './customer/a4papper/a4papper.component';
import { AllA4Component } from './admin/categories/all-a4/all-a4.component';
import { EditA4Component } from './admin/categories/edit-a4/edit-a4.component';
import { EditKeyboardComponent } from './admin/categories/edit-keyboard/edit-keyboard.component';
import { AllKeyboardComponent } from './admin/categories/all-keyboard/all-keyboard.component';
import { EditLaminationComponent } from './admin/categories/edit-lamination/edit-lamination.component';
import { AllLaminationComponent } from './admin/categories/all-lamination/all-lamination.component';
import { AddLiminationComponent } from './admin/categories/add-limination/add-limination.component';
import { AllMouseComponent } from './admin/categories/all-mouse/all-mouse.component';
import { EditMouseComponent } from './admin/categories/edit-mouse/edit-mouse.component';
import { AllMuharComponent } from './admin/categories/all-muhar/all-muhar.component';
import { EditMuharComponent } from './admin/categories/edit-muhar/edit-muhar.component';
import { AllPrinterComponent } from './admin/categories/all-printer/all-printer.component';
import { EditPrinterComponent } from './admin/categories/edit-printer/edit-printer.component';
import { AboutComponent } from './customer/about/about.component';




export const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  {
    path: "", component: CustomerLayoutComponent, children: [
      { path: "home", component: HomeComponent },
      { path: "category", component: CategoryComponent },
      { path: "product", component: ProductComponent },
      { path: "services", component: ServicesComponent },
      { path: "weddingCard", component: WeddingCardComponent },

      { path: "keyboards", component: KeyboardComponent },
      { path: "printers", component: PrinterComponent },
      { path: "mouses", component: MouseComponent },
      { path: "lamination", component: LiminationComponent },
      { path: "muhar", component: MuharComponent },
      { path: "a4", component: A4papperComponent },

      { path: "order/details", component: OrderDetailsComponent },
      { path: "about", component: AboutComponent },
      { path: "contact", component: ContactComponent },
      { path: "cart", component: CartComponent },
      { path: "billings", component: BillingsComponent },
      { path: "testimonial", component: TestimonialComponent },
      { path: "error", component: ErrorComponent },
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
      { path: "orders/:id", component: OrdersComponent },
      { path: "serviceBook/:id", component: ServiceAppointmentComponent },

      { path: "myAccount", component: MyAccountComponent },
      { path: "paymentGateway", component: PaymentComponent },
      { path: "profile", component: RegisterComponent, canActivate: [userGuard] },
    ]
  }, {
    path: "admin", component: AdminLayoutComponent, canActivate: [userGuard], children: [
      { path: "dashboard", component: DashboardComponent },


      { path: "allOrders", component: AllOrdersComponent },
      { path: "category/manage", component: CategoriesComponent },


      { path: "add/category", component: AddCategoryComponent },
      { path: "update/category", component: UpdateCategoryComponent },
      { path: "manage-category", component: UpdateCategoryComponent },
      { path: "edit-category/:id", component: EditCategoryComponent },

      { path: "printer", component: AddPrinterComponent },
      { path: "keyboard", component: AddKeyboardComponent },
      { path: "stamp", component: AddMuharComponent },
      { path: "lamination", component: AddLiminationComponent },
      { path: 'mouse', component: AddmouseComponent },
      { path: "a4", component: AddA4Component },
      { path: "edit/product/:id", component: EditProductComponent },
      { path: "addProduct", component: AddProductComponent },
      { path: "viewProduct", component: AllProductComponent },
      { path: "all/A4", component: AllA4Component },
      { path: "all/Keyboard", component: AllKeyboardComponent },
      { path: "all/Lamination", component: AllLaminationComponent },
      { path: "all/mouse", component: AllMouseComponent },
      { path: "all/muhar", component: AllMuharComponent },
      { path: "all/printers", component: AllPrinterComponent },
      { path: "a4papers/edit/:id", component: EditA4Component },
      { path: 'keyboards/edit/:id', component: EditKeyboardComponent },
      { path: 'edit-lamination/:id', component: EditLaminationComponent },
      { path: 'edit-mouse/:id', component: EditMouseComponent },
      { path: 'edit-muhar/:id', component: EditMuharComponent },
      { path: 'edit-printer/:id', component: EditPrinterComponent},
      { path: "addServices", component: AddServicesComponent },
      { path: 'edit-service/:id', component: EditServicesComponent },
      { path: 'viewServices', component: AllServicesComponent },

      { path: "addWeddingCard", component: AddWeddingCardComponent },
      { path: 'edit-wedding/card/:id', component: EditWeddingCardComponent },
      { path: 'viewWeddingCard', component: AllWeddingCardComponent }

    ]
  },
  { path: "**", redirectTo: "/error" }
];
