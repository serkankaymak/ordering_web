"use client"
import { useOrderEvents } from "@/app/providers/orderEvents.provider";
import Toast from "@/shared/Toast";
import React, { useEffect } from "react";


interface MemberLayoutContentProps {
    children: React.ReactNode;
}


const MemberLayoutContent: React.FC<MemberLayoutContentProps> = ({ children }) => {

    const { addOnOrderCreatedListener, addOnOrderDeliveredListener ,addOnOrderPayedListener, addOnOrderPreparedListener } = useOrderEvents();

    useEffect(() => {
        // "Created" event geldiğinde konsola yazdıracak callback ekleniyor.
        addOnOrderCreatedListener("MemberLayoutContent", (orderEvent) => {
            console.log(orderEvent);
            Toast.success("Siparişiniz alındı!");
        });

        addOnOrderPayedListener("MemberLayoutContent", (orderEvent) => {
            console.log(orderEvent);
            Toast.success("Umarım keyif almışsınızdır. Yine bekleriz!!");
        });

        addOnOrderPreparedListener("MemberLayoutContent", (orderEvent) => {
            console.log(orderEvent);
            Toast.success("Siparişiniz hazırlandı!");
        });

        addOnOrderDeliveredListener("MemberLayoutContent", (orderEvent) => {
            console.log(orderEvent);
            Toast.success("Siparişiniz teslim edildi!");
        });


    }, []);

    return (

        <div>
            {children}
        </div>
    );
};

export default React.memo(MemberLayoutContent);
