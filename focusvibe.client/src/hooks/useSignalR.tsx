import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const useSignalR = () => {
    const [sessionData, setSessionData] = useState<any>(null);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5122/liveUpdateHub")
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => console.log("Connected toSignalR hub"))
            .catch(err => console.error("SignalR connection error: ", err));

        connection.on("ReceiveUpdate", (eventType, data) => {
            console.log(`Received event: ${eventType}`, data);
            if (eventType === "FocusSessionStarted") {
                setSessionData(data);
            }
        });

        return () => {
            connection.stop();
        };
    }, []);

    return sessionData;
};

export default useSignalR;
