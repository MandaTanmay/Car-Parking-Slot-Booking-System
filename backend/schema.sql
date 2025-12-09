-- Car Parking Slot Booking System Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (for clean migration)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS slots CASCADE;
DROP TABLE IF EXISTS parking_lots CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parking Lots Table
CREATE TABLE parking_lots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    description TEXT,
    total_slots INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10, 2) DEFAULT 50.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Slots Table
CREATE TABLE slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parking_lot_id UUID NOT NULL REFERENCES parking_lots(id) ON DELETE CASCADE,
    slot_code VARCHAR(50) NOT NULL,
    slot_type VARCHAR(20) DEFAULT 'car' CHECK (slot_type IN ('car', 'bike', 'ev')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(parking_lot_id, slot_code)
);

-- Bookings Table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slot_id UUID NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    vehicle_number VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'booked', 'cancelled', 'checked_in', 'completed')),
    qr_code_token TEXT,
    total_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Indexes for performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_slot_id ON bookings(slot_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_time_range ON bookings(start_time, end_time);
CREATE INDEX idx_slots_parking_lot ON slots(parking_lot_id);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (Optional)
-- Create an admin user (you'll need to replace with real Firebase UID after first login)
INSERT INTO users (name, email, firebase_uid, role) 
VALUES ('Admin User', 'admin@example.com', 'admin_firebase_uid_placeholder', 'admin');

-- Create a sample parking lot
INSERT INTO parking_lots (name, address, description, total_slots)
VALUES ('Downtown Parking Complex', '123 Main Street', 'Secure parking facility in city center', 50);

-- Get the parking lot ID (for inserting slots)
DO $$
DECLARE
    lot_id UUID;
BEGIN
    SELECT id INTO lot_id FROM parking_lots WHERE name = 'Downtown Parking Complex';
    
    -- Create sample slots
    INSERT INTO slots (parking_lot_id, slot_code, slot_type, is_active)
    VALUES 
        (lot_id, 'A1', 'car', true),
        (lot_id, 'A2', 'car', true),
        (lot_id, 'A3', 'car', true),
        (lot_id, 'A4', 'car', true),
        (lot_id, 'A5', 'car', true),
        (lot_id, 'B1', 'bike', true),
        (lot_id, 'B2', 'bike', true),
        (lot_id, 'B3', 'bike', true),
        (lot_id, 'EV1', 'ev', true),
        (lot_id, 'EV2', 'ev', true);
END $$;
