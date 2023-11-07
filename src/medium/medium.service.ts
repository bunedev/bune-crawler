import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { ReadMultipleDto } from './dto/read-multiple.dto';

@Injectable()
export class MediumService {
  browser: puppeteer.Browser;
  constructor() {}

  async readMedium(query: ReadMultipleDto) {
    const { listUrl } = query;
    if (!this.browser) {
      // Khởi động trình duyệt nếu chưa tồn tại
      const options = {
        headless: false,
        defaultViewport: null,
        executablePath:
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        userDataDir:
          'C:\\Users\\devho\\AppData\\Local\\Google\\Chrome\\User Data\\Default',
      };
      this.browser = await puppeteer.launch(options);
    }

    for (const url of listUrl) {
      await this.handleMedium(url);
    }
    return true;
  }

  async handleMedium(url: string) {
    try {
      const page = await this.browser.newPage();

      await page.goto(url);

      // claps
      await page.waitForSelector("[data-testid='headerClapButton']");

      // Click vào nút "headerClapButton"
      for (let i = 0; i < 50; i++) {
        await page.click("[data-testid='headerClapButton']");
      }

      // comment
      await page.waitForSelector("button[aria-label='responses']");
      const responseButtons = await page.$$("button[aria-label='responses']");
      await responseButtons[0].click();
      await page.waitForTimeout(2000);

      // Chờ một chút để đảm bảo trường form đã tải lên
      await page.waitForSelector("[data-slate-placeholder='true']");

      // Nhập dữ liệu vào trường form
      await page.type(
        "[data-slate-placeholder='true']",
        await this.randomComment(),
      );

      // Bấm vào nút "ResponseRespondButton"
      await page.click("[data-testid='ResponseRespondButton']");
      // Đợi một thời gian ngắn để thực hiện các thao tác khác nếu cần
      await page.waitForTimeout(2000);
      page.close();
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async randomComment() {
    // Mảng các phương án khen bài
    const praiseComments = [
      'Great article! Thanks for sharing.',
      'This is really insightful. I learned a lot.',
      'I appreciate the effort you put into this.',
      'Well-written and informative. Keep it up!',
      'Fantastic content. I enjoyed reading this.',
      'Your writing is exceptional. Keep it going!',
      "I'm impressed by your knowledge on this topic.",
      'You have a talent for explaining complex concepts.',
      'Brilliant work. I look forward to more from you.',
      "You're a great source of valuable information.",
      'Your insights are always on point.',
      'This article exceeded my expectations!',
      'You make complex topics easy to understand.',
      "You're a true expert in your field.",
      'Your writing style is engaging and informative.',
      'This is a must-read for anyone interested in the topic.',
      "I've learned so much from your articles.",
      'Your content always stands out. Well done!',
      'You have a unique perspective that I appreciate.',
      'Your articles are a valuable resource. Thank you!',
    ];

    // Chọn ngẫu nhiên một phương án khen bài từ mảng
    const randomIndex = Math.floor(Math.random() * praiseComments.length);
    const randomComment = praiseComments[randomIndex];

    return randomComment;
  }
}
