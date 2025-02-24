export enum OrderEventType {
    Created = 0,
    Updated = 1,
    Prepared = 2,
    Delivered = 3,
    Payed = 4,
}

export class OrderEvent {
    // Nesne oluşturulduğu anda tarih bilgisini atıyoruz.
    public dateOccurred: Date = new Date();
    public orderEventType: OrderEventType;
    public orderId: number;
    public orderNumber: string;
    public userId?: number;
    public tableId: number;

    constructor(init?: Partial<OrderEvent>) {
        // Varsayılan değerler
        this.orderEventType = OrderEventType.Created;
        this.orderId = 0;
        this.orderNumber = "";
        this.tableId = 0;

        if (init) {
            Object.assign(this, init);
            // Eğer json'dan gelen dateOccurred varsa, onu Date objesine çeviriyoruz.
            if (init.dateOccurred && !(init.dateOccurred instanceof Date)) {
                this.dateOccurred = new Date(init.dateOccurred);
            }
        }
    }

    copy(updatedFields: Partial<OrderEvent>): OrderEvent {
        return new OrderEvent({ ...this, ...updatedFields });
    }

    static fromJson(json: any): OrderEvent {
        try {
            return new OrderEvent({
                ...json,
                dateOccurred: json.dateOccurred ? new Date(json.dateOccurred) : new Date(),
            });
        } catch (e: any) {
            console.error("error parsing...", e);
            return OrderEvent.getEmptyInstance();
        }
    }

    static getEmptyInstance(): OrderEvent {
        return new OrderEvent();
    }
}
