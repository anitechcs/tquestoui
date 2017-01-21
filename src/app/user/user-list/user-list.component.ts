import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../shared/services/toolbox.service';
import { MdSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { UserService, IUser } from '../../shared/services/user.service';

@Component({
  selector: 'tq-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements AfterViewInit {

  users: IUser[];
  filteredUsers: IUser[];

  constructor(private toolbox: ToolboxService,
              private _router: Router,
              private _loadingService: TdLoadingService,
              private _dialogService: TdDialogService,
              private _snackBarService: MdSnackBar,
              private _userService: UserService) {
    toolbox.setToolBox({
        title: "User Management", 
        actions: [
          {icon: 'add', tooltip: 'Add', callback: this.callBack},
          {icon: 'refresh', tooltip: 'Refresh', callback: this.callBack}
        ],
        more: [
          {text: 'View All', tooltip: 'View All', callback: this.callBack},
          {text: 'Edit', tooltip: 'Edit', callback: this.callBack},
          {text: 'Delete', tooltip: 'Delete', callback: this.callBack}
        ]
    });
  }

  callBack() {

  }

  goBack(route: string): void {
    this._router.navigate(['/home/users']);
  }

  ngAfterViewInit(): void {
    this.loadUsers();
  }

  filterUsers(displayName: string = ''): void {
    this.filteredUsers = this.users.filter((user: IUser) => {
      return user.display_name.toLowerCase().indexOf(displayName.toLowerCase()) > -1;
    });
  }

  loadUsers(): void {
    this._loadingService.register('users.list');
    this._userService.query().subscribe((users: IUser[]) => {
      this.users = users;
      this.filteredUsers = users;
      this._loadingService.resolve('users.list');
    }, (error: Error) => {
      this._userService.staticQuery().subscribe((users: IUser[]) => {
        this.users = users;
        this.filteredUsers = users;
        this._loadingService.resolve('users.list');
      });
    });
  }

  deleteUser(id: string): void {
    this._dialogService
      .openConfirm({message: 'Are you sure you want to delete this user?'})
      .afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          this._loadingService.register('users.list');
          this._userService.delete(id).subscribe(() => {
            this.users = this.users.filter((user: IUser) => {
              return user.id !== id;
            });
            this.filteredUsers = this.filteredUsers.filter((user: IUser) => {
              return user.id !== id;
            });
            this._loadingService.resolve('users.list');
            this._snackBarService.open('User deleted', 'Ok');
          }, (error: Error) => {
            this._dialogService.openAlert({message: 'There was an error'});
            this._loadingService.resolve('users.list');
          });
        }
      });
  }

}
