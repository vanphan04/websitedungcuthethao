-- Script to add password column to khachhang table if it doesn't exist
-- Run this in your MySQL client or phpmyadmin

ALTER TABLE khachhang ADD COLUMN password VARCHAR(255) NULL;

-- Create an index on email for faster login queries
ALTER TABLE khachhang ADD UNIQUE INDEX idx_email (email);
