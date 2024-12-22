package com.celeste.remedicard.io.auth.config;

import com.celeste.remedicard.io.auth.entity.User;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SpringSecurityAuditorAware implements AuditorAware<String> {

  @Override
  public Optional<String> getCurrentAuditor() {
    User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    return Optional.of(user.getUsername());
  }
}
