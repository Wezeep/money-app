package com.wezeep.api.controller;

import com.wezeep.service.FxRateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/fx")
public class FxRateController {

    private final FxRateService fxRateService;

    public FxRateController(FxRateService fxRateService) {
        this.fxRateService = fxRateService;
    }

    @GetMapping("/rate")
    public ResponseEntity<Map<String, Object>> getExchangeRate(
            @RequestParam String from,
            @RequestParam String to) {
        BigDecimal rate = fxRateService.getExchangeRate(from, to);
        return ResponseEntity.ok(Map.of(
                "from", from,
                "to", to,
                "rate", rate
        ));
    }
}
