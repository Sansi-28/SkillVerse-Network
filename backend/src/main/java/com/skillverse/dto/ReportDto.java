package com.skillverse.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReportDto(
        @NotNull Long reportedUserId,
        @NotNull @Size(min = 10, max = 2000) String reason
) {}