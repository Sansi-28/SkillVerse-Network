// backend/src/main/java/com/skillverse/controller/SignalController.java
package com.skillverse.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class SignalController {

    private final SimpMessagingTemplate template;

    public SignalController(SimpMessagingTemplate template) {
        this.template = template;
    }

    public static class SignalPayload {
        public String type;     // "offer" | "answer" | "candidate"
        public String fromUserId;
        public Object data;     // SDP or ICE json
    }

    @MessageMapping("/rooms/{roomId}/signal")
    public void relay(@DestinationVariable String roomId, SignalPayload payload) {
        template.convertAndSend("/topic/rooms/" + roomId, payload);
    }
}
