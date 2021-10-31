package com.jason.crypto.service;


import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Log4j2
public class FileService {

    @Value("${track.file.dir}")
    private String FILE_DIR;

    public void write(String str) {
        new File(FILE_DIR).mkdir();

        String today = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        try {
            final Path path = Paths.get(FILE_DIR + today + ".txt");
            Files.write(path, Collections.singletonList(str), StandardCharsets.UTF_8,
                Files.exists(path) ? StandardOpenOption.APPEND : StandardOpenOption.CREATE);
            log.info("write success: " + path);
        } catch (IOException e) {
            log.error("", e);
            // Add your own exception handling...
        }
    }

    public List<String> read(String date) throws IOException {
        final Path path = Paths.get(FILE_DIR + date + ".txt");
        return Files.readAllLines(path, StandardCharsets.UTF_8);
    }
}