import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

export abstract class ASignalRService {
  private connection: HubConnection;

  constructor(private hubUrl: string) {
    // SignalR bağlantısını oluşturuyoruz.
    this.connection = new HubConnectionBuilder()
      .withUrl(this.hubUrl) // Hub URL’inizi buraya girin
      .withAutomaticReconnect() // Otomatik yeniden bağlanma özelliği
      .build();
  }

  // Bağlantıyı başlatmak için
  public async start(): Promise<void> {
    try {
      await this.connection.start();
      console.log('SignalR bağlantısı başarılı!');
    } catch (error) {
      console.error('SignalR bağlantısı başlatılamadı:', error);
    }
  }

  // Bağlantıyı durdurmak için
  public async stop(): Promise<void> {
    try {
      await this.connection.stop();
      console.log('SignalR bağlantısı sonlandırıldı.');
    } catch (error) {
      console.error('SignalR bağlantısı durdurulamadı:', error);
    }
  }

  // Belirli bir event’i dinlemek için
  public on(eventName: string, callback: (...args: any[]) => void): void {
    this.connection.on(eventName, callback);
  }

  // Event dinleyicisini kaldırmak için
  public off(eventName: string, callback: (...args: any[]) => void): void {
    this.connection.off(eventName, callback);
  }

  // Sunucu metodlarını çağırmak için
  public async invoke(methodName: string, ...args: any[]): Promise<any> {
    try {
      return await this.connection.invoke(methodName, ...args);
    } catch (error) {
      console.error(`'${methodName}' metodu çağrılırken hata oluştu:`, error);
      throw error;
    }
  }
}



export  class SignalRService extends ASignalRService {}

export interface IHubService {}