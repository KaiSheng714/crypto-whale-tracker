package com.jason.crypto.controller;


import com.jason.crypto.service.FileService;
import com.jason.crypto.service.LightCrawlerService;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.log4j.Log4j2;
import org.apache.logging.log4j.util.Strings;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
public class ApiController {

    private final FileService fileService;

    private final LightCrawlerService lightCrawlerService;

    public ApiController(FileService fileService, LightCrawlerService lightCrawlerService) {
        this.fileService = fileService;
        this.lightCrawlerService = lightCrawlerService;
    }

    @ResponseBody
    @GetMapping("api/v1/whale/{date}")
    public Map<String, List<String>> getWhale(@PathVariable("date") String date) throws IOException {
        log.info("Request: " + date);
        Map<String, List<String>> map = new HashMap<>();
        map.put("data", fileService.read(date));
        return map;
    }

    @ResponseBody
    @GetMapping("api/v1/light/{date}")
    public Map<String, String> getIndexLight(@PathVariable("date") String date) {
        log.info("Request: " + date);
        Map<String, String> map = new HashMap<>();
        String data = lightCrawlerService.read(date);
        if (Strings.isBlank(data)) {
            throw new IllegalArgumentException("Not found");
        }
        map.put("data", data);
        return map;
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handle(IllegalArgumentException e) {
        return ResponseEntity.badRequest().build();
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<String> handle(IOException e) {
        log.error("", e);
        return ResponseEntity.badRequest().build();
    }

}
