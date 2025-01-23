import { Component, Input, Output, EventEmitter, ChangeDetectorRef, SimpleChange, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent {
  @Input() contacts: any[] = [];
  @Input() selectedContact: any;
  @Output() contactSelected = new EventEmitter<any>();

  searchTerm: string = '';
  filteredContacts: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.filteredContacts = this.contacts;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contacts'] && this.contacts) {
      this.filterContacts();
    }
  }

  filterContacts(): void {
    if (!this.searchTerm) {
      this.filteredContacts = this.contacts;
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredContacts = this.contacts.filter(
      (contact) =>
        contact.login.toLowerCase().includes(searchTermLower) ||
        contact.lastMessage.toLowerCase().includes(searchTermLower)
    );
  }

  selectContact(contact: any): void {
    this.contactSelected.emit(contact);
    this.router.navigate(['/default/message', contact.id]);
  }

  isSelected(contact: any): boolean {
    console.log('Selected contact:', contact);
    if (!this.selectedContact) return false;
    return contact.id === this.selectedContact.id;
  }

  isReadStatus(contact: any): boolean {
    return contact.readStatus;
  }
}
