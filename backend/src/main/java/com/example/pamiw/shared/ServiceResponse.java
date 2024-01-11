package com.example.pamiw.shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.experimental.SuperBuilder;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
@SuperBuilder
public class ServiceResponse<T> {
    public T data;
    public Boolean isSuccess;
    public String message;
}
