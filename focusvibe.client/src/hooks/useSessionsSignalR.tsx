import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

interface SessionUser {
    id: number;
    username: string;
}

const useSessionsSignalR = () => {
    const [sessionsData, setSessionsData] = useState<SessionUser[]>([]);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5122/liveUpdateHub")
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => console.log("Connected to SignalR hub for sessions"))
            .catch(err => console.error("SignalR connection error: ", err));

        connection.on("ReceiveSessionsUpdate", (eventType, data) => {
            if (eventType === "SessionsUpdate") {
                setSessionsData(data);
            }
        });

        return () => {
            connection.stop();
        };
    }, []);

    return sessionsData;
};

export default useSessionsSignalR;