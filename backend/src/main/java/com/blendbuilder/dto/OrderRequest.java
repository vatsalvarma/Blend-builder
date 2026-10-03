package com.blendbuilder.dto;

import jakarta.validation.constraints.*;
import java.util.List;
import java.util.Map;

public class OrderRequest {
    @NotBlank
    public String blendName;

    @NotBlank
    public String serveStyle;

    @NotEmpty
    public List<String> selectedIds;

    @NotEmpty
    public Map<String, Integer> ratios;

    @NotNull
    @Min(0) @Max(3)
    public Short roastIdx;

    @NotBlank
    public String cafeName;

    @NotBlank
    public String contactName;

    @NotBlank
    @Pattern(regexp = "^[6-9]\\d{9}$")
    public String phone;

    @NotBlank
    public String city;

    @NotNull
    public Integer sampleGrams;

    public String notes;

    @NotNull
    public Long consentAt;

    public Object flight; // Optional JSON for flight mode

    public Object switchFrom; // Optional JSON for Upgrade C
}
