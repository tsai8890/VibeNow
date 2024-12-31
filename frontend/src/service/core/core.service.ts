import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  status = signal('');
  uid = signal('');
  rid = signal('');
  todayDate = signal('');
  language = signal('en');

  STATUS_CODES = new Map();

  constructor() {
    this.STATUS_CODES.set('INIT', 'init');
    this.STATUS_CODES.set('WAITING', 'waiting');
    this.STATUS_CODES.set('IN_ROOM', 'in_room');

    this.status.set(this.STATUS_CODES.get('INIT'));
  }

  setUID(uid: string) {
    this.uid.set(uid);
  }

  setRID(rid: string) {
    this.rid.set(rid);
  }

  updateDate() {
    const today = new Date();
    const date = today.getDate();

    if (this.language() === 'en') {
      const month = today.toLocaleString('en-US', { month: 'short' });

      let dateSuffix = 'th';
      if (date === 1) {
        dateSuffix = 'st';
      } else if (date === 2) {
        dateSuffix = 'nd';
      } else if (date === 3) {
        dateSuffix = 'rd';
      }
      this.todayDate.set(`${month} ${date}${dateSuffix}`);
    }
    else if (this.language() === 'ch') {
      const month = today.getMonth() + 1; // Months are 0-based, so add 1
      this.todayDate.set(`${month}月${date}日`);
    }
  }

  enterQueue() {
    this.status = this.STATUS_CODES.get('WAITING');
  }

  inQueue() {
    return this.status === this.STATUS_CODES.get('WAITING');
  }

  enterRoom() {
    this.status = this.STATUS_CODES.get('IN_ROOM');
  }

  inRoom() {
    return this.status === this.STATUS_CODES.get('IN_ROOM');
  }

  init() {
    this.status = this.STATUS_CODES.get('INIT');
  }

  isInit() {
    return this.status === this.STATUS_CODES.get('INIT');
  }
}
