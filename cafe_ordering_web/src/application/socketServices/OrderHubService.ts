import { ASignalRService, IHubService, SignalRService } from '@/shared/ASignalRService';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { OrderEvent, OrderEventType } from './events/OrderEvents';

const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL;

export interface IOrderHubService extends IHubService { }

export class OrderHubService implements IOrderHubService {
    private async wait(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private signalRService: SignalRService;
    // OrderCreated event'leri için callback saklanıyor.
    private onOrderCreatedListener?: (orderEvent: OrderEvent) => void;
    private onOrderUpdatedListener?: (orderEvent: OrderEvent) => void;
    private onOrderPreparedListener?: (orderEvent: OrderEvent) => void;
    private onOrderPayedListener?: (orderEvent: OrderEvent) => void;
    private onOrderDeliveredListener?: (orderEvent: OrderEvent) => void;


    constructor() {
        // HOST_URL + "/orderHub" şeklinde bağlantı URL'si oluşturuluyor.
        this.signalRService = new SignalRService(`${HOST_URL}/orderHub`);
    }

    public async start(): Promise<void> {
        return this.signalRService.start();
    }

    public async stop(): Promise<void> {
        return this.signalRService.stop();
    }

    public listenChannel(): void {
        this.signalRService.on("ReceiveOrderEvent", (args: any) => {
            console.log("event geldi!!");
            console.log("args", args);
            const event = OrderEvent.fromJson(args);
            // Eğer event tipi Created ve listener tanımlı ise çağır.
            this.wait(3000).then(() => {
                if (event.orderEventType === OrderEventType.Created && this.onOrderCreatedListener) {
                    this.onOrderCreatedListener(event);
                }
                if (event.orderEventType === OrderEventType.Updated && this.onOrderUpdatedListener) {
                    this.onOrderUpdatedListener(event);
                }
                if (event.orderEventType === OrderEventType.Prepared && this.onOrderPreparedListener) {
                    this.onOrderPreparedListener(event);
                }
                if (event.orderEventType === OrderEventType.Delivered && this.onOrderDeliveredListener) {
                    this.onOrderDeliveredListener(event);
                }
                if (event.orderEventType === OrderEventType.Payed && this.onOrderPayedListener) {
                    this.onOrderPayedListener(event);
                }
            })

        });
    }

    public setOnOrderCreatedListener(listener: (orderEvent: OrderEvent) => void): void {
        this.onOrderCreatedListener = listener;
    }

    public setOnOrderUpdatedListener(listener: (orderEvent: OrderEvent) => void): void {
        this.onOrderUpdatedListener = listener;
    }

    public setOnOrderPreparedListener(listener: (orderEvent: OrderEvent) => void): void {
        this.onOrderPreparedListener = listener;
    }

    public setOnOrderDeliveredListener(listener: (orderEvent: OrderEvent) => void): void {
        this.onOrderDeliveredListener = listener;
    }

    public setOnOrderPayedListener(listener: (orderEvent: OrderEvent) => void): void {
        this.onOrderPayedListener = listener;
    }

    public clearListeners() {
        this.onOrderCreatedListener = undefined;
        this.onOrderUpdatedListener = undefined;
        this.onOrderPreparedListener = undefined;
        this.onOrderDeliveredListener = undefined;
        this.onOrderPayedListener = undefined;
    }

} 
