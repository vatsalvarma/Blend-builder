package com.blendbuilder.controller;

import com.blendbuilder.entity.*;
import com.blendbuilder.repository.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final OriginRepository originRepository;
    private final SettingsRepository settingsRepository;
    private final OrderRepository orderRepository;
    private final AuditLogRepository auditLogRepository;
    private final SupplyRepository supplyRepository;

    public AdminController(OriginRepository originRepository, SettingsRepository settingsRepository, OrderRepository orderRepository, AuditLogRepository auditLogRepository, SupplyRepository supplyRepository) {
        this.originRepository = originRepository;
        this.settingsRepository = settingsRepository;
        this.orderRepository = orderRepository;
        this.auditLogRepository = auditLogRepository;
        this.supplyRepository = supplyRepository;
    }

    private void logAudit(String what, String before, String after) {
        String who = SecurityContextHolder.getContext().getAuthentication().getName();
        AuditLog log = new AuditLog();
        log.setId(UUID.randomUUID().toString());
        log.setWho(who);
        log.setWhat(what);
        log.setBeforeState(before);
        log.setAfterState(after);
        log.setAt(System.currentTimeMillis());
        auditLogRepository.save(log);
    }

    @GetMapping("/origins")
    public List<Origin> getAllOrigins() {
        return originRepository.findAll();
    }

    @PutMapping("/origins")
    public void saveOrigins(@RequestBody List<Origin> origins) {
        originRepository.saveAll(origins);
        logAudit("Updated Origins", null, null); // Ideally serialize origins
    }

    @PutMapping("/settings")
    public void saveSettings(@RequestBody Settings req) {
        req.setId((short) 1);
        settingsRepository.save(req);
        logAudit("Updated Settings", null, req.getData());
    }

    @GetMapping("/orders")
    public List<Order> getOrders(@RequestParam(defaultValue = "0") int page) {
        return orderRepository.findAll(PageRequest.of(page, 50, Sort.by(Sort.Direction.DESC, "createdAt"))).getContent();
    }

    @PatchMapping("/orders/{id}")
    public Map<String, String> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> updates) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        if (updates.containsKey("outcome")) {
            order.setOutcome(updates.get("outcome"));
        }
        
        if (updates.containsKey("status")) {
            String newStatus = updates.get("status");
            // Forward only logic goes here
            order.setStatus(newStatus);
            
            if ("shipped".equals(newStatus)) {
                // Generate token
                byte[] tokenBytes = new byte[32];
                new SecureRandom().nextBytes(tokenBytes);
                String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
                
                try {
                    MessageDigest digest = MessageDigest.getInstance("SHA-256");
                    byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
                    String hashStr = Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
                    order.setFeedbackTokenHash(hashStr);
                    orderRepository.save(order);
                    return Map.of("feedbackToken", rawToken);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }
        }
        orderRepository.save(order);
        return Map.of();
    }

    @GetMapping("/audit")
    public List<AuditLog> getAuditLogs(@RequestParam(defaultValue = "0") int page) {
        return auditLogRepository.findAll(PageRequest.of(page, 100, Sort.by(Sort.Direction.DESC, "at"))).getContent();
    }

    @GetMapping("/supplies")
    public List<Supply> getSupplies() {
        return supplyRepository.findAll();
    }

    @PostMapping("/supplies")
    public Supply createSupply(@RequestBody Supply s) {
        s.setId(UUID.randomUUID().toString());
        return supplyRepository.save(s);
    }

    @PatchMapping("/supplies/{id}")
    public void markReminded(@PathVariable String id) {
        Supply s = supplyRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        s.setRemindedAt(System.currentTimeMillis());
        supplyRepository.save(s);
    }
}
