import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import myFile from './myFile.json';

interface USERS {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  avatar: string;
  domain: string;
  available: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
[x: string]: any;

  title = 'Assignment';
  Users: USERS[] = myFile;
  CompleteUsers: USERS[] = myFile;
  FilteredUsers: USERS[] = myFile;

  totalItems: number = 1;
  currentPage: number = 0;
  perPage: number = 20;
  totalPages: number = 1;
  selectedPage: number = 0;

  searchText: string = '';
  selectedDomain: string = '';
  selectedGender: string = '';
  onlyAvailable: boolean = false;

  displayedUsers: USERS[] = [];
  uniqueDomains: string[] = [];
  uniqueGenders: string[] = [];
  team: USERS[] = [];


  constructor() {
    this.totalItems = this.Users.length;
    console.log(this.totalItems);
    this.fetchUserData();
    this.initializeFilters();
  }

  fetchUserData() {
    const startIndex = this.selectedPage * this.perPage;
    const jsonData = [];

    for (let i = startIndex; i < startIndex + this.perPage && i < this.totalItems; i++) {
      jsonData.push(this.FilteredUsers[i]);
    }

    this.displayedUsers = jsonData;
  }

  changePage(action: string | number) {
    if (action === 'prev') {
      if (this.selectedPage > 0) {
        this.selectedPage--;
        this.currentPage--;
        this.fetchUserData();
      } else {
        alert('You are on the first page.');
      }
    } else if (action === 'next') {
      if (this.selectedPage < this.totalPages - 1) {
        this.selectedPage++;
        this.currentPage++;
        this.fetchUserData();
      } else {
        alert('You are on the last page.');
      }
    } else if (typeof action === 'number' && action >= 0 && action < this.totalPages) {
      if (action !== this.selectedPage) {
        this.selectedPage = action;
        this.currentPage = action;
        this.fetchUserData();
      }
    }
  }



  getPages(totalItems: number, perPage: number): number[] {
    this.totalPages = Math.ceil(totalItems / perPage);
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  searchUsers() {
    const jsonData = [];
    for (let i = 0; i < this.CompleteUsers.length; i++) {
      if(this.CompleteUsers[i].first_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      this.CompleteUsers[i].last_name.toLowerCase().includes(this.searchText.toLowerCase()))
      jsonData.push(this.CompleteUsers[i]);
    }
    this.FilteredUsers = jsonData;
    this.totalItems = this.FilteredUsers.length;
    this.selectedPage = 0;
    this.fetchUserData();
  }

  initializeFilters() {
    this.uniqueDomains = this.getUniqueValues('domain');
    this.uniqueGenders = this.getUniqueValues('gender');
  }

  getUniqueValues(key: keyof USERS): string[] {
    const uniqueValues = Array.from(new Set(this.CompleteUsers.map(user => user[key])));
    return uniqueValues.filter(value => typeof value === 'string' && value !== undefined) as string[];
  }

  applyFilters() {

    const jsonData = [];
    for (let i = 0; i < this.CompleteUsers.length; i++) {
      if((this.selectedDomain === "" || this.CompleteUsers[i].domain === this.selectedDomain) &&
      (this.selectedGender === "" || this.CompleteUsers[i].gender == this.selectedGender) && 
      (!this.onlyAvailable || this.CompleteUsers[i].available))
      jsonData.push(this.CompleteUsers[i]);
    }
    this.FilteredUsers = jsonData;
    this.totalItems = this.FilteredUsers.length;
    this.selectedPage = 0;
    this.fetchUserData();
  }

  createTeam() {
    const uniqueDomains: string[] = Array.from(new Set(this.displayedUsers.map(user => user.domain)));
    this.team = this.displayedUsers.filter(user => uniqueDomains.includes(user.domain));
    console.log('Team Details:', this.team);
  }

  addToTeam(user: USERS) {
    if (!this.team.some(member => member.domain === user.domain)) {
      this.team.push(user);
    } else {
      alert('A user from the same domain is already in the team.');
    }
  }
}
