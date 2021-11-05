package com.jason.crypto.service;


import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.TimerTask;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import javax.annotation.PostConstruct;
import lombok.extern.log4j.Log4j2;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Log4j2
public class CrawlerService {

    @Autowired
    private FileService fileService;

    @Value("${crawler.period.minute}")
    private int periodMinute;

    @PostConstruct
    public void doCrawlerJob() {
        ScheduledExecutorService scheduledExecutor = Executors.newSingleThreadScheduledExecutor();
        scheduledExecutor.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                crawler();
            }
        }, millisToNextHour(), periodMinute * 60 * 1000, TimeUnit.MILLISECONDS);
    }

    private long millisToNextHour() {
        LocalDateTime nextHour = LocalDateTime.now().plusHours(1).truncatedTo(ChronoUnit.HOURS);
        return LocalDateTime.now().until(nextHour, ChronoUnit.MILLIS);
    }

    public void crawler() {
        try {
            log.info("do crawler");

            Document doc = Jsoup.connect("https://www.whalestats.com/ethereum-wallets/heatmap-erc20-tokens").get();
            log.info(doc.title());
            String html = doc.body().html();

            String timeJson = String.format("\"time\":\"%s\"", new SimpleDateFormat("HH:mm").format(new Date()));
            String topJson = html.substring(html.indexOf("\"top\":"), html.indexOf(",\"others\":{"));
            String json = String.format("{%s,%s}", timeJson, topJson);
            log.info("{}", json);
            fileService.write(json);
        } catch (Exception e) {
            log.error("", e);
        }

    }


}