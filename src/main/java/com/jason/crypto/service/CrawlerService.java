package com.jason.crypto.service;


import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;
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
        Timer t = new Timer();
        t.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                crawler();
            }
        }, 0, periodMinute * 60 * 1000);
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