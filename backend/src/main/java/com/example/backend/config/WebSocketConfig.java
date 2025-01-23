package com.example.backend.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.util.MultiValueMap;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.HandshakeInterceptor;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Arrays;
import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:4200")  // Ensure to allow your frontend origin
                .addInterceptors(new HttpHandshakeInterceptor())
                .withSockJS();
    }

    static class HttpHandshakeInterceptor implements HandshakeInterceptor {

        private static final Log logger = LogFactory.getLog(HttpHandshakeInterceptor.class);

        @Override
        public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

            MultiValueMap<String, String> queryParams = UriComponentsBuilder.fromUri(request.getURI()).build().getQueryParams();
            String token = queryParams.getFirst("token");
            String userId = queryParams.getFirst("userId");

            if (token == null || userId == null) {
                response.setStatusCode(HttpStatus.UNAUTHORIZED);
                return false;
            }
//            String query = request.getURI().getQuery();
//            String token = Arrays.stream(query.split("&"))
//                    .filter(s -> s.startsWith("token="))
//                    .findFirst()
//                    .orElseThrow(() -> new IllegalArgumentException("Token is required"))
//                    .split("=")[1];
//            String userId = Arrays.stream(query.split("&"))
//                    .filter(s -> s.startsWith("userId="))
//                    .findFirst()
//                    .orElseThrow(() -> new IllegalArgumentException("User ID is required"))
//                    .split("=")[1];

            if (!authenticateToken(token)) {
                logger.error("Invalid token provided: " + token);
                response.setStatusCode(HttpStatus.UNAUTHORIZED);
                return false;
            }
            attributes.put("userId", userId);

            // Log the contents of the attributes map
            logger.info("Attributes map contents: " + attributes);
            return true;
        }

        @Override
        public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {}

        private boolean authenticateToken(String token) {
            try {
//                JWTVerifier verifier = JWT.require(Algorithm.HMAC256("secretKey")).build();
//                verifier.verify(token);
                return true;
            } catch (IllegalArgumentException e) {
                return false;
            }
        }
    }

}
