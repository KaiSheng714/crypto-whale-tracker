package com.jason.crypto.controller;


import com.jason.crypto.service.FileService;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
public class IndexController {

    private final FileService fileService;

    public IndexController(FileService fileService) {
        this.fileService = fileService;
    }

    @ResponseBody
    @GetMapping("api/v1/data/{date}")
    public Map<String, List<String>> get(@PathVariable("date") String date) throws IOException {
        log.info("Request: " + date);
        Map<String, List<String>> map = new HashMap<>();
        map.put("data", fileService.read(date));
        return map;
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<String> handle(Exception e) {
        return ResponseEntity.badRequest().build();
    }

}
