package com.skillverse.model.enums;

public enum BookingStatus {
    PENDING,
    CONFIRMED, // Funds are in escrow
    REJECTED,
    COMPLETED, // Funds have been released
    CANCELLED,
    IN_DISPUTE   // Funds are frozen in escrow
}