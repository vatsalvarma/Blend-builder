-- V1__init.sql

CREATE TABLE origins (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    flag CHAR(2),
    type VARCHAR(20) CHECK (type IN ('Arabica', 'Robusta', 'Liberica')),
    grade VARCHAR(100),
    color VARCHAR(20),
    tag VARCHAR(255) DEFAULT '',
    flavor JSON,
    price_per_kg DECIMAL(10,2) DEFAULT 0,
    in_stock BOOLEAN DEFAULT TRUE,
    updated_at BIGINT
);

CREATE TABLE settings (
    id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    data JSON
);

CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    blend_name VARCHAR(255),
    serve_style VARCHAR(50),
    selected_ids JSON,
    ratios JSON,
    roast_idx SMALLINT CHECK (roast_idx >= 0 AND roast_idx <= 3),
    cafe_name VARCHAR(255),
    contact_name VARCHAR(255),
    phone CHAR(10),
    city VARCHAR(255),
    sample_grams INT,
    notes TEXT,
    consent_at BIGINT,
    status VARCHAR(50) DEFAULT 'new',
    outcome VARCHAR(50),
    created_at BIGINT,
    feedback_token_hash VARCHAR(255),
    feedback JSON,
    flight JSON,
    switch_from JSON
);
CREATE INDEX idx_orders_created_at ON orders (created_at DESC);

CREATE TABLE audit_log (
    id VARCHAR(36) PRIMARY KEY,
    who VARCHAR(255),
    what VARCHAR(255),
    before_state JSON,
    after_state JSON,
    at BIGINT
);

CREATE TABLE supplies (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36),
    cafe_name VARCHAR(255),
    contact_name VARCHAR(255),
    phone CHAR(10),
    blend_name VARCHAR(255),
    serve_style VARCHAR(50),
    selected_ids JSON,
    ratios JSON,
    roast_idx SMALLINT,
    kg DECIMAL(8,2),
    delivered_at BIGINT,
    roasted_at BIGINT,
    cups_per_day INT,
    dose_grams DECIMAL(5,1),
    reminded_at BIGINT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);
