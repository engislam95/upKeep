import { Injectable, OnInit } from "@angular/core";
import Pusher from "pusher-js";
// import Pusher from 'pusher-js/with-encryption';


@Injectable()
export class WebSocketService {
  // Pusher Variable

  pusher: any = "";

  constructor() {
    this.pusher = new Pusher("25c1e6831c9ab31ebd27", {
      cluster: "eu",
      // auth: {
      //   params: { foo: "bar" },
      //   headers: { baz: "boo" }
      // }
    });

  }

  // Listen To Channels and Subscribe them
  listenChannel(name) {

    var channel = this.pusher.subscribe(name);
    this.pusher.connection.bind("connected", this.connectedExecute());


    channel.bind('ActiveEvent', function (data, metadata) {
      console.log(
        "I received", data,
      );

      return data ;
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
