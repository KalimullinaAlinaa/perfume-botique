import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  customerData: any = null;
  orderHistory: any[] = [];
  activeTab: string = 'profile';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCustomerData();
    this.loadOrderHistory();
  }

  loadCustomerData(): void {
    const savedData = localStorage.getItem('customerData');
    if (savedData) {
      this.customerData = JSON.parse(savedData);
    }
  }

  loadOrderHistory(): void {
    const savedHistory = localStorage.getItem('orderHistory');
    if (savedHistory) {
      this.orderHistory = JSON.parse(savedHistory);
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getActiveOrders(): any[] {
    return this.orderHistory.filter(order => 
      order.status === 'pending' || order.status === 'processing'
    );
  }

  getCompletedOrders(): any[] {
    return this.orderHistory.filter(order => 
      order.status === 'completed' || order.status === 'delivered'
    );
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Ожидает обработки',
      'processing': 'В обработке',
      'completed': 'Завершен',
      'delivered': 'Доставлен'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'completed': 'status-completed',
      'delivered': 'status-delivered'
    };
    return classMap[status] || 'status-pending';
  }

  goToCatalog(): void {
    this.router.navigate(['/catalog']);
  }
}