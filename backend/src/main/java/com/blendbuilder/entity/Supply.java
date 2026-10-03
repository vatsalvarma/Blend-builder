package com.blendbuilder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "supplies")
public class Supply {

    @Id
    private String id;

    @Column(name = "order_id")
    private String orderId;

    @Column(name = "cafe_name")
    private String cafeName;

    @Column(name = "contact_name")
    private String contactName;

    @Column(length = 10)
    private String phone;

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

    private Double kg;

    @Column(name = "delivered_at")
    private Long deliveredAt;

    @Column(name = "roasted_at")
    private Long roastedAt;

    @Column(name = "cups_per_day")
    private Integer cupsPerDay;

    @Column(name = "dose_grams")
    private Double doseGrams;

    @Column(name = "reminded_at")
    private Long remindedAt;

    // Getters and Setters omitted for brevity but standard
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getCafeName() { return cafeName; }
    public void setCafeName(String cafeName) { this.cafeName = cafeName; }
    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
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
    public Double getKg() { return kg; }
    public void setKg(Double kg) { this.kg = kg; }
    public Long getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(Long deliveredAt) { this.deliveredAt = deliveredAt; }
    public Long getRoastedAt() { return roastedAt; }
    public void setRoastedAt(Long roastedAt) { this.roastedAt = roastedAt; }
    public Integer getCupsPerDay() { return cupsPerDay; }
    public void setCupsPerDay(Integer cupsPerDay) { this.cupsPerDay = cupsPerDay; }
    public Double getDoseGrams() { return doseGrams; }
    public void setDoseGrams(Double doseGrams) { this.doseGrams = doseGrams; }
    public Long getRemindedAt() { return remindedAt; }
    public void setRemindedAt(Long remindedAt) { this.remindedAt = remindedAt; }
}
