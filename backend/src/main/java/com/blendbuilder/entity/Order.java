package com.blendbuilder.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    private String id;

    @Column(name = "blend_name")
    private String blendName;

    @Column(name = "serve_style")
    private String serveStyle;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "selected_ids")
    private String selectedIds;

    @JdbcTypeCode(SqlTypes.JSON)
    private String ratios;

    @Column(name = "roast_idx")
    private Short roastIdx;

    @Column(name = "cafe_name")
    private String cafeName;

    @Column(name = "contact_name")
    private String contactName;

    @Column(length = 10)
    private String phone;

    private String city;

    @Column(name = "sample_grams")
    private Integer sampleGrams;

    private String notes;

    @Column(name = "consent_at")
    private Long consentAt;

    private String status = "new";

    private String outcome;

    @Column(name = "created_at")
    private Long createdAt;

    @Column(name = "feedback_token_hash")
    private String feedbackTokenHash;

    @JdbcTypeCode(SqlTypes.JSON)
    private String feedback;

    @JdbcTypeCode(SqlTypes.JSON)
    private String flight;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "switch_from")
    private String switchFrom;

    // Getters and Setters omitted for brevity but they are standard...
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBlendName() { return blendName; }
    public void setBlendName(String blendName) { this.blendName = blendName; }
    public String getServeStyle() { return serveStyle; }
    public void setServeStyle(String serveStyle) { this.serveStyle = serveStyle; }
    public String getSelectedIds() { return selectedIds; }
    public void setSelectedIds(String selectedIds) { this.selectedIds = selectedIds; }
    public String getRatios() { return ratios; }
    public void setRatios(String ratios) { this.ratios = ratios; }
    public Short getRoastIdx() { return roastIdx; }
    public void setRoastIdx(Short roastIdx) { this.roastIdx = roastIdx; }
    public String getCafeName() { return cafeName; }
    public void setCafeName(String cafeName) { this.cafeName = cafeName; }
    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public Integer getSampleGrams() { return sampleGrams; }
    public void setSampleGrams(Integer sampleGrams) { this.sampleGrams = sampleGrams; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Long getConsentAt() { return consentAt; }
    public void setConsentAt(Long consentAt) { this.consentAt = consentAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getOutcome() { return outcome; }
    public void setOutcome(String outcome) { this.outcome = outcome; }
    public Long getCreatedAt() { return createdAt; }
    public void setCreatedAt(Long createdAt) { this.createdAt = createdAt; }
    public String getFeedbackTokenHash() { return feedbackTokenHash; }
    public void setFeedbackTokenHash(String feedbackTokenHash) { this.feedbackTokenHash = feedbackTokenHash; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public String getFlight() { return flight; }
    public void setFlight(String flight) { this.flight = flight; }
    public String getSwitchFrom() { return switchFrom; }
    public void setSwitchFrom(String switchFrom) { this.switchFrom = switchFrom; }
}
