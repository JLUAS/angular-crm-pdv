import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';

// Define una interfaz para los headers (opcional)
export interface ProductHeader {
  columnName: string;
  dataType: string;
  inputType: string;
}

@Component({
  selector: 'app-add-product',
  standalone: false,
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  modal:boolean = false
  productForm!: FormGroup;
  headers: ProductHeader[] = [];
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  // Para manejar archivos (ya que input file se maneja diferente)
  fileValues: { [key: string]: File } = {};

  constructor(private fb: FormBuilder, private productsService: ProductsService) {}

  ngOnInit(): void {
    // Obtener los headers del backend
    this.productsService.getProductHeaders().subscribe({
      next: (data: ProductHeader[]) => {
        this.headers = data;
        this.createForm();
      },
      error: (error) => {
        console.error('Error al obtener los headers', error);
        this.errorMessage = 'Error al cargar la configuración del producto';
      }
    });
  }

  // Crea un formulario dinámico basado en los headers (ignorando "id" por ejemplo)
  createForm(): void {
    const group: any = {};
    this.headers.forEach(header => {
      if (header.columnName !== 'id') {
        if (header.inputType !== 'file') {
          // Agregamos Validators.required para que el campo sea obligatorio
          group[header.columnName] = new FormControl('', Validators.required);
        }
      }
    });
    this.productForm = this.fb.group(group);
  }


  // Maneja el evento change de un input file
  onFileSelected(event: any, controlName: string): void {
    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];
      // Guarda el archivo en un objeto auxiliar para luego incluirlo en el FormData
      this.fileValues[controlName] = file;
    }
  }

  // Retorna true si todos los campos tipo file requeridos tienen archivo
  allRequiredFilesSelected(): boolean {
    // Filtra los headers de tipo file (ignorando "id")
    const requiredFileHeaders = this.headers.filter(header => header.inputType === 'file' && header.columnName !== 'id');
    // Verifica que para cada uno exista un archivo en fileValues
    for (let header of requiredFileHeaders) {
      if (!this.fileValues[header.columnName]) {
        return false;
      }
    }
    return true;
  }


  // Envía el formulario para agregar el producto
  addNewProduct(): void {
    if (!this.productForm.valid || !this.allRequiredFilesSelected()) {
      this.errorMessage = "Por favor, completa todos los campos requeridos";
      return;
    }

    this.isLoading = true;
    const formData = new FormData();

    // Agrega todos los campos del formulario que no sean file
    Object.keys(this.productForm.value).forEach(key => {
      formData.append(key, this.productForm.value[key]);
    });

    // Agrega los campos de tipo file (si los hubiere)
    Object.keys(this.fileValues).forEach(key => {
      formData.append(key, this.fileValues[key], this.fileValues[key].name);
    });

    this.productsService.addProduct(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log("Producto agregado:", response);
        this.errorMessage = "";
        this.successMessage = "Producto agregado correctamente";
        this.productForm.reset();
        this.fileValues = {};
      },
      error: (error) => {
        this.isLoading = false;
        console.error("Error al agregar el producto:", error);
        this.successMessage = "";
        this.errorMessage = "Hubo un error al agregar el producto";
      }
    });
  }

}
