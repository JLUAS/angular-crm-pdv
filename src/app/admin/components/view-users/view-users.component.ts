import { Component, OnInit } from '@angular/core';
import { UserTable, UserTableEdit } from '../../../models/User';
import { UsersService } from '../../../services/users.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-view-users',
  standalone: false,
  templateUrl: './view-users.component.html',
  styleUrl: './view-users.component.css'
})
export class ViewUsersComponent implements OnInit{
  users: UserTable[] = [];
  paginatedData: UserTable[] = [];
  editUser: UserTableEdit | null = null; // Usuario que se está editando
  editedUser: UserTable | null = null; // Usuario que se editado
  deleteUser: UserTable | null = null; // Usuario que se está editando
  isAdmin: boolean = false;
  isRoot: boolean = false;
  isEditModal: boolean = false;
  isDeleteModal: boolean = false;
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private usersService:UsersService){}

  ngOnInit(): void {
   this.loadUsers()
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usersService.getUsers().subscribe(
      (users: UserTable[]) => {
        this.users = users;
        console.log(users)
        this.totalPages = Math.ceil(this.users.length / this.pageSize);
        this.paginateData();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
        this.errorMessage = 'Error al cargar los usuarios.';
        this.isLoading = false;
      }
    );
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  calculateTotalPages(): void {
    const totalItems = this.users.length;
    this.totalPages = Math.ceil(totalItems / this.pageSize);
    this.paginateData()
  }

  paginateData(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.users.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateData();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateData();
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateData();
    }
  }

  editModal(user: UserTable): void {
    this.editUser = { ...user }; // Copiar los datos del usuario a editar
    this.isEditModal = true;
  }

  deleteModal(user: UserTable): void {
    this.deleteUser = { ...user }; // Copiar los datos del usuario a editar
    this.isDeleteModal = true;
  }

  closeEditModal(): void {
    this.isEditModal = false;
    this.deleteUser = null; // Limpiar datos del usuario en edición
    this.errorMessage = ""
  }

  closeDeleteModal(): void {
    this.isDeleteModal = false;
    this.deleteUser = null; // Limpiar datos del usuario en edición
    this.errorMessage = ""
  }

  saveUserChanges(form: NgForm): void {
    if (this.editUser) {
      this.usersService.editUser(this.editUser).subscribe(
        (response) => {
          this.errorMessage="No se pudo actualizar el usuario."
        },
        (error) => {
          this.closeEditModal();
          this.loadUsers(); // Refrescar la tabla
          console.error('Error al actualizar usuario:', error);
          this.errorMessage = 'No se pudo actualizar el usuario.';
        }
      );
    } else {
      this.errorMessage = 'No se pudo actualizar el usuario, datos no válidos.';
    }
  }

  deleteUserChange(form: NgForm): void {
    if (this.deleteUser) {
      this.usersService.deleteUser(this.deleteUser).subscribe(
        (response) => {
          console.error('Error al eliminar usuario:', response);
          this.errorMessage = 'No se pudo eliminar el usuario.';
        },
        (error) => {
          this.closeEditModal();
          this.loadUsers();
        }
      );
    }else{
      this.errorMessage = 'No se pudo eliminar el usuario, datos no validos.';
    }
  }

  // Manejo del cambio de estado desde el select
  onStatusChange(value: string): void {
    if (this.editUser) {
      this.editUser.status = value === 'Activo';
    }
  }

}
