package com.jason.crypto.service;


import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.TimerTask;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import javax.annotation.PostConstruct;
import lombok.extern.log4j.Log4j2;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;

@Service
@Log4j2
public class LightCrawlerService {

    private Map<String, String> map;


    public LightCrawlerService() {
        map = new HashMap<>();
    }

    @PostConstruct
    public void doCrawlerJob() {
        ScheduledExecutorService scheduledExecutor = Executors.newSingleThreadScheduledExecutor();
        scheduledExecutor.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                crawler();
            }
        }, 0, 60 * 60 * 1000, TimeUnit.MILLISECONDS);
    }

    public void crawler() {
        try {
            log.info("do crawler");

            Document doc = Jsoup.connect("https://www.2140.media/indexnew/light").get();
            log.info(doc.title());
            for (Element e : doc.body().getElementsByTag("ul")) {
                String html = e.parent().html();

                String date = html.substring(html.indexOf("▍指數燈號"), html.indexOf("</strong>"))
                    .replaceAll("\\D+", "");  // 移除數字以外的字
                String text = e.text();
                log.info("{}", date);
                log.info("{}", text);
                map.put(date, text);
            }
        } catch (Exception e) {
            log.error("", e);
        }

    }

    public String read(String date) {
        date = date.replace("-", "");
        return map.get(date);
    }
}