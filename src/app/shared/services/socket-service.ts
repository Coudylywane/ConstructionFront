// import { Injectable } from "@angular/core";
// //import { Stomp } from "@stomp/stompjs";
// //import * as SockJS from "sockjs-client";
// import { Subject } from "rxjs";

// @Injectable({
//     providedIn: 'root'
//   })

// export class SocketService{
//     webSocketEndPoint: string = "http://localhost:8091/ws";
//     topic: string = "/topic/greetings";
//     stompClient : any;
//     subject = new Subject<string>();

//     constructor(){
//         this._connect();
//     }

//     _connect(){
//         console.log("Initializing WebSocket connection");
//         let ws = new SockJS(this.webSocketEndPoint);
//         this.stompClient = Stomp.over(ws);
//         const _this = this;

//         _this.stompClient.connect({}, function (frame:any){
//             _this.stompClient.subscribe(_this.topic, function (sdkEvent:any){
//                 _this.onMessageReceived(sdkEvent);
//             })
//         },_this.erroCallback);
//     }
//     onMessageReceived(message: any) {
//         console.log("Message received");
//         const result = JSON.parse(message.body);
//         this.subject.next(result.content);
//     }
//     erroCallback(error: any) {
//        console.log("errorCallback ->" +error);
//        setTimeout(()=>{
//         this._connect();
//        },5000);
//     }

//     _disconnect(){
//         if (this.stompClient && this.stompClient!== null) {
//             this.stompClient.disconnect();
//         }
//         console.log("Disconnect");

//     }

//     _send(message:any){
//         console.log("calling logOut");
//         this.stompClient.send("/app/hello",{},JSON.stringify(message));
//     }
//   }
