package com.wezeep.api.controller;

import com.wezeep.service.CountryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/countries")
public class CountryController {

    private final CountryService countryService;

    public CountryController(CountryService countryService) {
        this.countryService = countryService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getAllCountries() {
        return ResponseEntity.ok(countryService.getAllCountries());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, String>>> searchCountries(@RequestParam String query) {
        return ResponseEntity.ok(countryService.searchCountries(query));
    }

    @GetMapping("/{code}")
    public ResponseEntity<Map<String, String>> getCountry(@PathVariable String code) {
        String name = countryService.getCountryName(code);
        if (name.equals(code)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("code", code, "name", name));
    }
}
