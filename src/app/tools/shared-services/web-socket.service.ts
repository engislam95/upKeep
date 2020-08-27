import { Injectable, OnInit } from "@angular/core";
import Pusher from "pusher-js";
// import Pusher from 'pusher-js/with-encryption';


@Injectable()
export class WebSocketService {
  // Pusher Variable

  pusher: any = "";

  constructor() {
    this.pusher = new Pusher("2140fece47d1d0c40378", {
      // appId: '1059775',
      // key: '2140fece47d1d0c40378',
      // secret: 'fb813ed36a6f4c65fd7e',
      cluster: 'eu',
      // encrypted: true
    });

  }

  // Listen To Channels and Subscribe them
  // listenChannel(names) {
  //   console.log(names)

  //   // Loop for channels Names
  //   for (let i = 0; i < names.length; i++) {
  //     // Subscribe channels
  //     console.log(names[i]);
      
  //     // "private-" +
  //     this.pusher.subscribe( names[i]);

  

  //     this.pusher.connection.bind("connected", this.connectedExecute());
  //   }
    
  //   Pusher.log = msg => {
  //     console.log(msg);
  //   };

  //   this.pusher.allChannels().forEach(channel => {
  //     console.log("Subscribe: ", channel.name);
  //   });
  // }


  listenChannel(name) {

    var channel = this.pusher.subscribe(name);
    this.pusher.connection.bind("connected", this.connectedExecute());


    channel.bind('ActiveEvent', function (data, metadata) {
      console.log(
        "I received", data,
      );
    });

    Pusher.log = msg => {
      console.log(msg);
    };

  }





  // Execute Function after connected
  connectedExecute() {
    /*
      Your Code 
    */
   console.log("successfully: ");

  }

  // Unsubscribe channels
  unsubscribueChannel(names) {
    for (let i = 0; i < names.length; i++) {
      this.pusher.unsubscribe("private-" + names[i]);

      Pusher.log = msg => {
        console.log(msg);
      };

      this.pusher.connection.bind("disconnected", this.disconnectExecute());
    }
    this.pusher.allChannels().forEach(channel => {
      console.log("Unsubscribe: ", channel.name);
    });
  }

  // Execute Fn after disconnected
  disconnectExecute() {
    /*
      Your Code 
      */
  }





}
