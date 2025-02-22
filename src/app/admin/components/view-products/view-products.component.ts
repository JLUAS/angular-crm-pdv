import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { FileService } from '../../../services/file.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

export interface ProductHeader {
  columnName: string;
  dataType: string;
  inputType: string;
}

// Interfaz para el producto, con propiedades fijas y dinámicas.
export interface Product {
  name: string;
  imageUrl: string;
  price: number;
  [key: string]: any;
}

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css'],
  standalone: false
})
export class ViewProductsComponent implements OnInit {

  modal: boolean = false;
  headers: ProductHeader[] = [];
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  products: Product[] = [];
  fileValues: { [key: string]: File } = {};

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private fileService: FileService
    // Si cuentas con un servicio de Stripe, inyectarlo aquí
    // private stripeService: StripeService
  ) {}

  ngOnInit(): void {
    this.productsService.getProductHeaders().subscribe({
      next: (data: ProductHeader[]) => {
        this.headers = data;
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error al obtener los headers', error);
        this.errorMessage = 'Error al cargar la configuración del producto';
      }
    });
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data.products;
        console.log(this.products)
      },
      error: (error) => {
        console.error('Error al cargar los productos', error);
        this.errorMessage = 'Error al cargar los productos';
      }
    });
  }

  buyProduct(product: Product): void {
    if (product.price) {
      this.productsService.createCheckoutSession({ price: product.price, name: product.name, image: product.imageUrl })
        .subscribe({
          next: (response) => {
            // Redirige a la URL que te devolvió el servidor
            console.log(response.url)
            window.location.href = response.url;
          },
          error: (err) => {
            console.error('Error creando la sesión de checkout:', err);
          }
        });
    } else {
      console.error('El producto no tiene precio definido.');
    }
  }
}
