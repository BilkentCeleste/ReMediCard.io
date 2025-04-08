package com.celeste.remedicard.io.autogeneration.config;

import com.celeste.remedicard.io.autogeneration.dto.DataProcessingTask;
import com.celeste.remedicard.io.autogeneration.dto.DeckCreationTask;
import com.celeste.remedicard.io.autogeneration.dto.QuizCreationTask;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, DataProcessingTask> redisTemplateDataProcessingTask(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, DataProcessingTask> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new Jackson2JsonRedisSerializer<DataProcessingTask>(DataProcessingTask.class));
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public RedisTemplate<String, DeckCreationTask> redisTemplateDeckCreationTask(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, DeckCreationTask> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new Jackson2JsonRedisSerializer<DeckCreationTask>(DeckCreationTask.class));
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public RedisTemplate<String, QuizCreationTask> redisTemplateQuizCreationTask(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, QuizCreationTask> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new Jackson2JsonRedisSerializer<QuizCreationTask>(QuizCreationTask.class));
        template.afterPropertiesSet();
        return template;
    }
}