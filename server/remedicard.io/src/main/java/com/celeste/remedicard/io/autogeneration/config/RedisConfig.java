package com.celeste.remedicard.io.autogeneration.config;

import com.celeste.remedicard.io.autogeneration.dto.DataProcessingTask;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, DataProcessingTask> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, DataProcessingTask> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new Jackson2JsonRedisSerializer<DataProcessingTask>(DataProcessingTask.class));
        template.afterPropertiesSet();
        return template;
    }
}