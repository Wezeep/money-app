package com.wezeep.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CountryService {

    private static final Map<String, String> COUNTRIES = new HashMap<>();

    static {
        COUNTRIES.put("US", "United States");
        COUNTRIES.put("GB", "United Kingdom");
        COUNTRIES.put("NG", "Nigeria");
        COUNTRIES.put("KE", "Kenya");
        COUNTRIES.put("GH", "Ghana");
        COUNTRIES.put("ZA", "South Africa");
        COUNTRIES.put("EG", "Egypt");
        COUNTRIES.put("IN", "India");
        COUNTRIES.put("PK", "Pakistan");
        COUNTRIES.put("BD", "Bangladesh");
        COUNTRIES.put("PH", "Philippines");
        COUNTRIES.put("VN", "Vietnam");
        COUNTRIES.put("ID", "Indonesia");
        COUNTRIES.put("MY", "Malaysia");
        COUNTRIES.put("SG", "Singapore");
        COUNTRIES.put("AU", "Australia");
        COUNTRIES.put("CA", "Canada");
        COUNTRIES.put("MX", "Mexico");
        COUNTRIES.put("BR", "Brazil");
        COUNTRIES.put("AR", "Argentina");
        COUNTRIES.put("CO", "Colombia");
        COUNTRIES.put("PE", "Peru");
        COUNTRIES.put("CL", "Chile");
        COUNTRIES.put("FR", "France");
        COUNTRIES.put("DE", "Germany");
        COUNTRIES.put("IT", "Italy");
        COUNTRIES.put("ES", "Spain");
        COUNTRIES.put("NL", "Netherlands");
        COUNTRIES.put("BE", "Belgium");
        COUNTRIES.put("CH", "Switzerland");
        COUNTRIES.put("AT", "Austria");
        COUNTRIES.put("SE", "Sweden");
        COUNTRIES.put("NO", "Norway");
        COUNTRIES.put("DK", "Denmark");
        COUNTRIES.put("FI", "Finland");
        COUNTRIES.put("PL", "Poland");
        COUNTRIES.put("CZ", "Czech Republic");
        COUNTRIES.put("GR", "Greece");
        COUNTRIES.put("PT", "Portugal");
        COUNTRIES.put("IE", "Ireland");
        COUNTRIES.put("NZ", "New Zealand");
        COUNTRIES.put("JP", "Japan");
        COUNTRIES.put("KR", "South Korea");
        COUNTRIES.put("CN", "China");
        COUNTRIES.put("HK", "Hong Kong");
        COUNTRIES.put("TW", "Taiwan");
        COUNTRIES.put("TH", "Thailand");
        COUNTRIES.put("AE", "United Arab Emirates");
        COUNTRIES.put("SA", "Saudi Arabia");
        COUNTRIES.put("IL", "Israel");
        COUNTRIES.put("TR", "Turkey");
        COUNTRIES.put("RU", "Russia");
        COUNTRIES.put("UA", "Ukraine");
    }

    public List<Map<String, String>> searchCountries(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllCountries();
        }

        String lowerQuery = query.toLowerCase();
        return COUNTRIES.entrySet().stream()
                .filter(entry -> 
                    entry.getKey().toLowerCase().contains(lowerQuery) ||
                    entry.getValue().toLowerCase().contains(lowerQuery))
                .map(entry -> {
                    Map<String, String> country = new HashMap<>();
                    country.put("code", entry.getKey());
                    country.put("name", entry.getValue());
                    return country;
                })
                .sorted(Comparator.comparing(c -> c.get("name")))
                .collect(Collectors.toList());
    }

    public List<Map<String, String>> getAllCountries() {
        return COUNTRIES.entrySet().stream()
                .map(entry -> {
                    Map<String, String> country = new HashMap<>();
                    country.put("code", entry.getKey());
                    country.put("name", entry.getValue());
                    return country;
                })
                .sorted(Comparator.comparing(c -> c.get("name")))
                .collect(Collectors.toList());
    }

    public String getCountryName(String code) {
        return COUNTRIES.getOrDefault(code, code);
    }

    public boolean isValidCountryCode(String code) {
        return COUNTRIES.containsKey(code);
    }
}
