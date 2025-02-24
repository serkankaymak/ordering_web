'use client';

import React, { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import { OrderHubService } from "@/application/socketServices/OrderHubService";
import { OrderEvent } from "@/application/socketServices/events/OrderEvents";

interface OrderEventsContextProps {

    addOnOrderCreatedListener: (key: string, listener: (orderEvent: OrderEvent) => void) => void;
    addOnOrderUpdatedListener: (key: string, listener: (orderEvent: OrderEvent) => void) => void;

    addOnOrderPreparedListener: (key: string, listener: (orderEvent: OrderEvent) => void) => void;
    addOnOrderDeliveredListener: (key: string, listener: (orderEvent: OrderEvent) => void) => void;
    addOnOrderPayedListener: (key: string, listener: (orderEvent: OrderEvent) => void) => void;
}

const OrderEventsContext = createContext<OrderEventsContextProps | undefined>(undefined);

export const OrderEventsProvider = ({ children }: { children: ReactNode }) => {
    const [mounted, setMounted] = useState(false);

    const serviceRef = useRef<OrderHubService | null>(null);

    if (!serviceRef.current) {
        serviceRef.current = new OrderHubService();
    }

    const service = serviceRef.current;


    // Listener listelerini Map ile tutuyoruz: key ile eklenen listener varsa üzerine yazılıyor.
    const orderCreatedListenersRef = useRef<Map<string, (orderEvent: OrderEvent) => void>>(new Map());
    const orderUpdatedListenersRef = useRef<Map<string, (orderEvent: OrderEvent) => void>>(new Map());

    const orderPreparedListenersRef = useRef<Map<string, (orderEvent: OrderEvent) => void>>(new Map());
    const orderDeliveredListenersRef = useRef<Map<string, (orderEvent: OrderEvent) => void>>(new Map());
    const orderPayedListenersRef = useRef<Map<string, (orderEvent: OrderEvent) => void>>(new Map());

    // Listener ekleme fonksiyonları: aynı key için ekleme yapıldığında, mevcut listener üzerine yazılır.
    const addOnOrderCreatedListener = (key: string, listener: (orderEvent: OrderEvent) => void) => {
        orderCreatedListenersRef.current.set(key, listener);
    };
    const addOnOrderUpdatedListener = (key: string, listener: (orderEvent: OrderEvent) => void) => {
        orderUpdatedListenersRef.current.set(key, listener);
    };
    const addOnOrderPreparedListener = (key: string, listener: (orderEvent: OrderEvent) => void) => {
        orderPreparedListenersRef.current.set(key, listener);
    };
    const addOnOrderDeliveredListener = (key: string, listener: (orderEvent: OrderEvent) => void) => {
        orderDeliveredListenersRef.current.set(key, listener);
    };
    const addOnOrderPayedListener = (key: string, listener: (orderEvent: OrderEvent) => void) => {
        orderPayedListenersRef.current.set(key, listener);
    };

    useEffect(() => {
        setMounted(true);
        console.log("orderEvents use effect executed");
        service
            .start()
            .then(() => {
                console.log("OrderEventsService başlatıldı");
                service.listenChannel();
                service.setOnOrderCreatedListener((orderEvent) => {
                    orderCreatedListenersRef.current.forEach((listener) => listener(orderEvent));
                });
                service.setOnOrderUpdatedListener((orderEvent) => {
                    orderUpdatedListenersRef.current.forEach((listener) => listener(orderEvent));
                });
                service.setOnOrderPreparedListener((orderEvent) => {
                    orderPreparedListenersRef.current.forEach((listener) => listener(orderEvent));
                });
                service.setOnOrderDeliveredListener((orderEvent) => {
                    orderDeliveredListenersRef.current.forEach((listener) => listener(orderEvent));
                });
                service.setOnOrderPayedListener((orderEvent) => {
                    orderPayedListenersRef.current.forEach((listener) => listener(orderEvent));
                });
            })
            .catch((error) => console.error("OrderEventsService başlatılırken hata:", error));

        return () => { service.clearListeners() };
    }, []);


    if (!mounted) { return null; }

    return (
        <OrderEventsContext.Provider
            value={{
                addOnOrderCreatedListener,
                addOnOrderUpdatedListener,
                addOnOrderPreparedListener,
                addOnOrderDeliveredListener,
                addOnOrderPayedListener,
            }}
        >
            {children}
        </OrderEventsContext.Provider>
    );
};

export const useOrderEvents = () => {
    const context = useContext(OrderEventsContext);
    if (!context) throw new Error("useOrderEvents must be used within an OrderEventsProvider");
    return context;
};
