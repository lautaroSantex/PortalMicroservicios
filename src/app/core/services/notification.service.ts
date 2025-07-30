import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: Date;
  read: boolean;
  serviceName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  public notifications$ = this.notificationsSubject.asObservable();
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor() {
    // Datos estáticos iniciales - no cambiarán
    this.initializeStaticNotifications();
  }

  private initializeStaticNotifications(): void {
    const staticNotifications: Notification[] = [
      {
        id: '1',
        title: 'CPU Usage Alert',
        message: 'notification-service está usando 78% CPU',
        type: 'warning',
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
        read: false,
        serviceName: 'notification-service'
      },
      {
        id: '2',
        title: 'New Service Registered',
        message: 'auth-service-v2 registrado en Consul',
        type: 'success',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
        read: false,
        serviceName: 'auth-service'
      },
      {
        id: '3',
        title: 'Vault Seal Status',
        message: 'Vault unsealed successfully',
        type: 'info',
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 min ago
        read: true,
        serviceName: 'vault'
      }
    ];

    // Establecer datos estáticos - no se actualizarán automáticamente
    this.notifications = staticNotifications;
    this.notificationsSubject.next(this.notifications);
    this.updateUnreadCount();
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification);
    this.notificationsSubject.next(this.notifications);
    this.updateUnreadCount();

    // Auto-remove after 5 minutes for success notifications
    if (notification.type === 'success') {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, 5 * 60 * 1000);
    }
  }

  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      this.notificationsSubject.next(this.notifications);
      this.updateUnreadCount();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.notificationsSubject.next(this.notifications);
    this.updateUnreadCount();
  }

  removeNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notificationsSubject.next(this.notifications);
    this.updateUnreadCount();
  }

  clearAllNotifications(): void {
    this.notifications = [];
    this.notificationsSubject.next(this.notifications);
    this.updateUnreadCount();
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  private updateUnreadCount(): void {
    const count = this.getUnreadCount();
    this.unreadCountSubject.next(count);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Métodos específicos para diferentes tipos de alertas
  addServiceAlert(serviceName: string, message: string, type: 'warning' | 'error' = 'warning'): void {
    this.addNotification({
      title: `${serviceName} Alert`,
      message,
      type,
      serviceName
    });
  }

  addSystemAlert(message: string, type: 'info' | 'warning' | 'error' = 'info'): void {
    this.addNotification({
      title: 'System Alert',
      message,
      type
    });
  }

  addSuccessMessage(message: string): void {
    this.addNotification({
      title: 'Success',
      message,
      type: 'success'
    });
  }

  // Simular notificaciones periódicas (DESACTIVADO para UI estática)
  startNotificationSimulation(): void {
    console.log('Notification simulation disabled for static UI');
    // Comentamos todo para que no genere notificaciones automáticas
    
    /* 
    const services = ['user-service', 'payment-service', 'notification-service', 'auth-service'];
    
    setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance
        const service = services[Math.floor(Math.random() * services.length)];
        const messages = [
          'High CPU usage detected',
          'Memory usage increased',
          'Response time elevated',
          'New deployment successful',
          'Health check passed'
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        const type = Math.random() > 0.7 ? 'warning' : 'info';
        
        this.addServiceAlert(service, message, type as 'warning' | 'error');
      }
    }, 30000); // Every 30 seconds
    */
  }
}