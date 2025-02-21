import { Component } from '@angular/core';
import { StripeFactoryService, StripeInstance } from "ngx-stripe";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { switchMap } from "rxjs";
import { FormBuilder } from '@angular/forms';
import { FileService } from '../../../services/file.service';
import { ProductsService } from '../../../services/products.service';

export interface Product {
  name: string;
  image: string;
  price: number;
  [key: string]: any;
}

export interface ProductHeader {
  columnName: string;
  dataType: string;
  inputType: string;
}

@Component({
  selector: 'app-payment',
  standalone: false,
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
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
        // Cargar la imagen para cada producto
        this.products.forEach(product => {
          this.loadFile(product.name);
        });
      },
      error: (error) => {
        console.error('Error al cargar los productos', error);
        this.errorMessage = 'Error al cargar los productos';
      }
    });
  }

  loadFile(name: string) {
    this.fileService.downloadFile(name).subscribe({
      next: (imageBlob) => {
        const url = window.URL.createObjectURL(imageBlob);
        const productIndex = this.products.findIndex(product => product.name === name);
        if (productIndex !== -1) {
          this.products[productIndex].image = url;
        }
      },
      error: (error) => {
        console.error('Error al cargar el archivo:', error);
      }
    });
  }

  buyProduct(product: Product): void {
    if (product.price) {
      this.productsService.createCheckoutSession({ price: product.price, name: product.name })
        .subscribe({
          next: (response) => {
            // Redirige a la URL que te devolvió el servidor
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
