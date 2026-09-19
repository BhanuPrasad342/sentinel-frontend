import { Client } from "@stomp/stompjs";

export function connectAlertWebSocket(
    username,
    password,
    onAlert,
    onStatus
) {
    const credentials = btoa(
        `${username}:${password}`
    );

    const client = new Client({

        brokerURL:
            "ws://localhost:8081/ws",

        reconnectDelay: 5000,

        connectHeaders: {
            Authorization:
                `Basic ${credentials}`
        },

        onConnect: () => {

            console.log(
                "SentinelUBA WebSocket connected"
            );

            if (onStatus) {
                onStatus("CONNECTED");
            }

            client.subscribe(
                "/topic/alerts",
                (message) => {

                    try {

                        const alert =
                            JSON.parse(message.body);

                        console.log(
                            "REAL-TIME ALERT:",
                            alert
                        );

                        if (onAlert) {
                            onAlert(alert);
                        }

                    } catch (error) {

                        console.error(
                            "Invalid WebSocket alert:",
                            error
                        );

                    }
                }
            );
        },

        onWebSocketError: (error) => {

            console.error(
                "WebSocket error:",
                error
            );

            if (onStatus) {
                onStatus("ERROR");
            }
        },

        onStompError: (frame) => {

            console.error(
                "STOMP error:",
                frame
            );

            if (onStatus) {
                onStatus("ERROR");
            }
        },

        onDisconnect: () => {

            console.log(
                "SentinelUBA WebSocket disconnected"
            );

            if (onStatus) {
                onStatus("DISCONNECTED");
            }
        }
    });

    client.activate();

    return client;
}