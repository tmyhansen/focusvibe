import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

interface NotificationUpdate {
    usernameStartedSession: string;
}

const useNotificationSignalR = () => {
    const [notificationData, setNotificationData] = useState<NotificationUpdate | null>(null);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5122/liveUpdateHub")
            .withAutomaticReconnect()
            .build();

        connection.start()
            .catch(err => console.error("SignalR connection error: ", err));

        connection.on("ReceiveUpdate", (eventType, data) => {
            if (eventType === "FocusSessionStarted") {
                setNotificationData(data);
            }
        });

        return () => {
            connection.stop();
        };
    }, []);

    return notificationData;
};

export default useNotificationSignalR;
