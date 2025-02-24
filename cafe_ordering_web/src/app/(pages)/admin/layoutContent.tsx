"use client"
import { useOrderEvents } from "@/app/providers/orderEvents.provider";
import Toast from "@/shared/Toast";
import React, { useEffect } from "react";


interface AdminLayoutContentProps {
    children: React.ReactNode;
}


const AdminLayoutContent: React.FC<AdminLayoutContentProps> = ({ children }) => {

    const { addOnOrderCreatedListener, addOnOrderDeliveredListener, addOnOrderPayedListener, addOnOrderPreparedListener } = useOrderEvents();

    useEffect(() => {
        // "Created" event geldiğinde konsola yazdıracak callback ekleniyor.
        addOnOrderCreatedListener("MemberLayoutContent", (orderEvent) => {
            console.log(orderEvent);
            Toast.success("Yeni sipariş var.");
        });

        addOnOrderDeliveredListener("MemberLayoutContent", (orderEvent) => {
            console.log(orderEvent);
            Toast.success(orderEvent.tableId + "numaralı masanın , " + orderEvent.orderNumber + " numaralı siparişi teslim edildi. ");
        });

    }, []);

    return (
        <div>
            {children}
        </div>
    );
};

export default React.memo(AdminLayoutContent);
