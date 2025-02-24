import { ASignalRService, IHubService, SignalRService } from '@/shared/ASignalRService';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

interface IOrderHubService extends IHubService { }

export class OrderHubService implements IOrderHubService {

    signalRService: SignalRService;
    constructor() {
        this.signalRService = new SignalRService("/orderHub");
    }


}
