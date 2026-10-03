package com.blendbuilder.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "settings")
public class Settings {

    @Id
    private Short id = 1;

    @JdbcTypeCode(SqlTypes.JSON)
    private String data; // JSON string containing all settings

    public Short getId() { return id; }
    public void setId(Short id) { this.id = id; }

    public String getData() { return data; }
    public void setData(String data) { this.data = data; }
}
