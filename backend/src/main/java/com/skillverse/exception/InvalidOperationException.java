package com.skillverse.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown for operations that are logically invalid in the current state,
 * such as a user trying to book their own listing or accept a booking that is not pending.
 * Results in a 400 Bad Request response.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidOperationException extends RuntimeException {
    public InvalidOperationException(String message) {
        super(message);
    }
}