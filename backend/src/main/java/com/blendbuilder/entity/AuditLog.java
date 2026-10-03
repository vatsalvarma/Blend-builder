package com.blendbuilder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "audit_log")
public class AuditLog {

    @Id
    private String id;

    private String who;
    private String what;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "before_state")
    private String beforeState;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "after_state")
    private String afterState;

    private Long at;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getWho() { return who; }
    public void setWho(String who) { this.who = who; }

    public String getWhat() { return what; }
    public void setWhat(String what) { this.what = what; }

    public String getBeforeState() { return beforeState; }
    public void setBeforeState(String beforeState) { this.beforeState = beforeState; }

    public String getAfterState() { return afterState; }
    public void setAfterState(String afterState) { this.afterState = afterState; }

    public Long getAt() { return at; }
    public void setAt(Long at) { this.at = at; }
}
