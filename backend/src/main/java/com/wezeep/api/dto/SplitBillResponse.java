package com.wezeep.api.dto;

import com.wezeep.domain.model.SplitBill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SplitBillResponse {
    private UUID id;
    private UUID creatorId;
    private String creatorName;
    private String title;
    private BigDecimal totalAmount;
    private String currency;
    private Boolean isEqualSplit;
    private SplitBill.SplitBillStatus status;
    private String notes;
    private String groupLink;
    private Instant createdAt;
    private List<ParticipantResponse> participants;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipantResponse {
        private UUID id;
        private UUID userId;
        private String userName;
        private BigDecimal amount;
        private BigDecimal paidAmount;
        private String status;
        private Instant paidAt;
    }
}
