import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { getRandomUSLocation } from 'src/common/helper';
import { IncreaseViewYoutubeDto } from './dto/increase-view.dto';

@Injectable()
export class YoutubeService {
  browser: puppeteer.Browser;
  browserEdge: puppeteer.Browser;
  distanceToFooter: number;
  count: number;
  constructor() {
    this.count = 0;
  }

  async increaseViewAnonymousPromise(increaseViewDto: IncreaseViewYoutubeDto) {
    const { url, numberPlay, timeReading , numberSession} = increaseViewDto;
    const promises = [];
    for (let i = 0; i < numberSession; i++) {
      promises.push(this.increaseViewAnonymous(increaseViewDto));
    }
    await Promise.all(promises);
  }
  
  async increaseViewAnonymous(increaseViewDto: IncreaseViewYoutubeDto) {
    const { url, numberPlay, timeReading , numberSession} = increaseViewDto;
  
    for (let i = 0; i < numberPlay; i++) {
      const options = {
        headless:false,// "new" as "new" | boolean,
        defaultViewport: null,
        ignoreDefaultArgs: ['--disable-extensions'],
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-dev-shm-usage',
          '--mute-audio',
          '--blink-settings=imagesEnabled=false',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding'
        ]
      };
      
      const browser = await puppeteer.launch(options);
      const context = await browser.createIncognitoBrowserContext()
      await context.overridePermissions(url, ['geolocation']);
      const page = await context.newPage();
      const location = getRandomUSLocation();
      await page.setGeolocation(location);
      try {
        await page.goto(url);

        await page.waitForTimeout(10000);
        //  check xem có tự động play không

        const isAutoPlay = await page.evaluate(() => {
          const videoElement = document.querySelector('video');
          return videoElement.autoplay;
        });
        console.log('isAutoPlay', isAutoPlay);
      
        // click button play
        const buttonPlay = await page.$('button[aria-label="Play"]');
        if (!isAutoPlay&&buttonPlay) {
          await buttonPlay.click();
        }

        // lấy thời lượng video seconds
        const videoDuration = await page.evaluate(() => {
          const videoElement = document.querySelector('video');
          return videoElement.duration;
        });
        console.log('videoDuration', videoDuration);
        // await page.waitForTimeout(videoDuration * 1000);
        await page.waitForTimeout(timeReading*1000);
        this.count++;
        console.log('Tổng số lần: ', this.count);
        await page.waitForTimeout(2000);
        await browser.close();
      } catch (error) {
        await browser.close();
      }
    }

    return true;
  }



 
}
