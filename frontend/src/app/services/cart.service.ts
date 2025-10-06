import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: any[] = [];
  private itemsSubject = new BehaviorSubject<any[]>([]);
  public cart$ = this.itemsSubject.asObservable();
  public cartUpdated = new Subject<void>();

  constructor() {
    this.load();
  }

  private emit() {
    this.itemsSubject.next([...this.items]);
    this.save();
    this.cartUpdated.next();
  }

  add(item: any) {
    const idx = this.items.findIndex(i => i.id === item.id);
    if (idx > -1) {
      this.items[idx].qty = (this.items[idx].qty || 1) + 1;
    } else {
      this.items.push({ ...item, qty: 1 });
    }
    this.emit();
  }

  // alias — компоненты используют addToCart иногда
  addToCart(item: any) {
    this.add(item);
  }

  remove(id: any) {
    this.items = this.items.filter(i => i.id !== id);
    this.emit();
  }

  updateQty(id: any, qty: number) {
    const i = this.items.find(it => it.id === id);
    if (i) {
      i.qty = qty;
      if (i.qty <= 0) this.remove(id);
      else this.emit();
    }
  }

  clear() {
    this.items = [];
    this.emit();
  }

  total() {
    return this.items.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0);
  }

  getItems() {
    return [...this.items];
  }

  getCount() {
    return this.items.reduce((s, i) => s + (i.qty || 1), 0);
  }

  private load() {
    try {
      const raw = localStorage.getItem('cart_v1');
      this.items = raw ? JSON.parse(raw) : [];
      this.itemsSubject.next([...this.items]);
    } catch {
      this.items = [];
    }
  }

  private save() {
    localStorage.setItem('cart_v1', JSON.stringify(this.items));
  }
}
