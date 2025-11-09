// backend/src/main/java/com/skillverse/controller/AvailabilityController.java
package com.skillverse.controller;

import com.skillverse.dto.AvailabilityDtos.*;
import com.skillverse.repository.UserRepository;
import com.skillverse.service.AvailabilityService;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/availability")
public class AvailabilityController {
    private final AvailabilityService service;
    private final UserRepository users;

    public AvailabilityController(AvailabilityService service, UserRepository users) {
        this.service = service; this.users = users;
    }

    private Long me(Principal p) { return users.findByEmail(p.getName()).orElseThrow().getId(); }

    @GetMapping("/teachers/{teacherId}/slots")
    public List<SlotResponse> listOpenByTeacher(@PathVariable Long teacherId) {
        return service.listOpenByTeacher(teacherId);
    }

    @GetMapping("/me/slots")
    public List<SlotResponse> mySlots(Principal p) {
        return service.listAllByTeacher(me(p));
    }

    @PostMapping("/slots")
    public SlotResponse create(Principal p, @RequestBody CreateSlotRequest req) {
        return service.create(me(p), req);
    }

    @DeleteMapping("/slots/{slotId}")
    public void delete(Principal p, @PathVariable Long slotId) {
        service.deleteOwned(me(p), slotId);
    }
}
