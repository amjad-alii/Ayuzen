package com.Ayuzen.Ayuzen.controlers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/chat")
public class ChatbotController {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    // This DTO will receive the chat history from the frontend
    // We can define it as a static inner class for simplicity
    static class ChatRequest {
        public Object contents;
        public Object systemInstruction;
        public String getContents() { return contents.toString(); } // Simplified
        public String getSystemInstruction() { return systemInstruction.toString(); } // Simplified
    }

    @PostMapping
    public ResponseEntity<String> chatWithGemini(@RequestBody String rawPayload) {
        // We use RestTemplate to make an HTTP call from our server to Google's server
        RestTemplate restTemplate = new RestTemplate();
        String geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=" + geminiApiKey;

        try {
            // Forward the exact payload from our frontend to the Gemini API
            String response = restTemplate.postForObject(geminiApiUrl, rawPayload, String.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Gemini API call failed: " + e.getMessage());
            return ResponseEntity.status(500).body("Error communicating with AI service.");
        }
    }
}
