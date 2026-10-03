package com.blendbuilder.controller;

import com.blendbuilder.dto.OrderRequest;
import com.blendbuilder.entity.Order;
import com.blendbuilder.entity.Origin;
import com.blendbuilder.entity.Settings;
import com.blendbuilder.repository.OrderRepository;
import com.blendbuilder.repository.OriginRepository;
import com.blendbuilder.repository.SettingsRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class PublicController {

    private final OriginRepository originRepository;
    private final SettingsRepository settingsRepository;
    private final OrderRepository orderRepository;
    private final ObjectMapper objectMapper;

    public PublicController(OriginRepository originRepository, SettingsRepository settingsRepository, OrderRepository orderRepository, ObjectMapper objectMapper) {
        this.originRepository = originRepository;
        this.settingsRepository = settingsRepository;
        this.orderRepository = orderRepository;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/origins")
    public List<Origin> getOrigins() {
        return originRepository.findByInStockTrue();
    }

    @GetMapping("/settings")
    public Settings getSettings() {
        return settingsRepository.findById((short) 1).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/orders")
    public Order createOrder(@Valid @RequestBody OrderRequest req) {
        // Additional business validation: ratios sum to 100
        int sum = req.ratios.values().stream().mapToInt(Integer::intValue).sum();
        if (sum != 100) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Ratios must sum to 100");
        }

        // Validate beans exist and are in stock
        for (String id : req.selectedIds) {
            Origin o = originRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid bean"));
            if (!o.getInStock()) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Bean out of stock");
            }
        }

        Order order = new Order();
        order.setId(UUID.randomUUID().toString());
        order.setBlendName(req.blendName);
        order.setServeStyle(req.serveStyle);
        try {
            order.setSelectedIds(objectMapper.writeValueAsString(req.selectedIds));
            order.setRatios(objectMapper.writeValueAsString(req.ratios));
            if (req.flight != null) {
                order.setFlight(objectMapper.writeValueAsString(req.flight));
            }
            if (req.switchFrom != null) {
                order.setSwitchFrom(objectMapper.writeValueAsString(req.switchFrom));
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        order.setRoastIdx(req.roastIdx);
        order.setCafeName(req.cafeName);
        order.setContactName(req.contactName);
        order.setPhone(req.phone);
        order.setCity(req.city);
        order.setSampleGrams(req.sampleGrams);
        order.setNotes(req.notes);
        order.setConsentAt(System.currentTimeMillis()); // Set from server clock per spec
        order.setStatus("new");
        order.setCreatedAt(System.currentTimeMillis());

        return orderRepository.save(order);
    }

    @GetMapping("/orders/{id}/feedback")
    public Map<String, Object> getFeedbackTarget(@PathVariable String id, @RequestParam("t") String token) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (order.getFeedbackTokenHash() == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            String hashStr = java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
            
            // Note: Use constant-time comparison in production
            if (!java.security.MessageDigest.isEqual(hashStr.getBytes(), order.getFeedbackTokenHash().getBytes())) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return Map.of("blendName", order.getBlendName(), "flightCodes", order.getFlight() != null ? order.getFlight() : "[]");
    }

    @PostMapping("/orders/{id}/feedback")
    public void submitFeedback(@PathVariable String id, @RequestParam("t") String token, @RequestBody String feedbackJson) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (order.getFeedbackTokenHash() == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            String hashStr = java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
            
            if (!java.security.MessageDigest.isEqual(hashStr.getBytes(), order.getFeedbackTokenHash().getBytes())) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        order.setFeedback(feedbackJson);
        order.setStatus("feedback");
        order.setFeedbackTokenHash(null); // Burn token
        orderRepository.save(order);
    }
}
