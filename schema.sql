-- ============================================================
-- Gate Pass Management System - PostgreSQL Schema
-- ============================================================

CREATE DATABASE gatepass_db;

\c gatepass_db;

-- Users Table (converted from MongoDB User collection)
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(50)  NOT NULL CHECK (role IN ('student','faculty','security','admin')),
    department  VARCHAR(255),
    register_number VARCHAR(100),
    year        VARCHAR(20),
    phone       VARCHAR(20),
    assigned_faculty_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gate Passes Table (converted from MongoDB GatePass collection)
CREATE TABLE gate_passes (
    id                    BIGSERIAL PRIMARY KEY,
    student_id            BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    faculty_id            BIGINT REFERENCES users(id) ON DELETE SET NULL,
    reason                TEXT NOT NULL,
    date                  DATE NOT NULL,
    out_time              VARCHAR(10) NOT NULL,
    expected_return_time  VARCHAR(10) NOT NULL,
    destination           VARCHAR(255),
    status                VARCHAR(50) DEFAULT 'pending'
                          CHECK (status IN ('pending','approved','rejected','expired','completed')),
    approved_by           BIGINT REFERENCES users(id) ON DELETE SET NULL,
    remarks               TEXT,
    qr_code               TEXT,
    qr_code_data          VARCHAR(500),
    exit_time             TIMESTAMP,
    entry_time            TIMESTAMP,
    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table (immutable - no update/delete)
CREATE TABLE audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    action      VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id   BIGINT,
    user_id     BIGINT NOT NULL REFERENCES users(id),
    user_role   VARCHAR(50),
    ip_address  VARCHAR(50),
    user_agent  TEXT,
    details     TEXT,
    timestamp   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_gate_passes_student_id ON gate_passes(student_id);
CREATE INDEX idx_gate_passes_status ON gate_passes(status);
CREATE INDEX idx_gate_passes_date ON gate_passes(date);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Default Admin User (password: admin123 - bcrypt hashed)
INSERT INTO users (name, email, password, role, department)
VALUES (
    'System Administrator',
    'admin@gatepass.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'admin',
    'Administration'
);
