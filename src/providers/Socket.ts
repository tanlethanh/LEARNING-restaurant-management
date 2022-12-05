import { Server } from "socket.io";
import http from "http"
// import server from "..";

class Socket {

    private io: Server | null = null
    
    constructor() {
        console.log("Init Socket - not enable")
    }

    public init(server: http.Server) {
        console.log("Init Socket with express server")
        this.io = new Server(server)
        this.io.on("connection", (socket) => {
            console.log("Socket catch new connection")

            socket.on("disconnected", () => {
                console.log("User disconnected")
            })

        })
    }

    public pushNotification(message: any) {
        console.log("pushNotification ", message)
        if (this.io != null) {
            this.io.emit('notification', JSON.stringify(message))
        }
    }

}

export default new Socket