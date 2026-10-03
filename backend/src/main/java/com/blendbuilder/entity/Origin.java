package com.blendbuilder.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "origins")
public class Origin {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2)
    private String flag;

    @Column(length = 20)
    private String type; // Arabica, Robusta, Liberica

    private String grade;
    
    private String color;

    private String tag = "";

    @JdbcTypeCode(SqlTypes.JSON)
    private String flavor; // JSON string

    @Column(name = "price_per_kg")
    private Double pricePerKg = 0.0;

    @Column(name = "in_stock")
    private Boolean inStock = true;

    @Column(name = "updated_at")
    private Long updatedAt;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFlag() { return flag; }
    public void setFlag(String flag) { this.flag = flag; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getFlavor() { return flavor; }
    public void setFlavor(String flavor) { this.flavor = flavor; }

    public Double getPricePerKg() { return pricePerKg; }
    public void setPricePerKg(Double pricePerKg) { this.pricePerKg = pricePerKg; }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }

    public Long getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Long updatedAt) { this.updatedAt = updatedAt; }
}
