import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { ReadMultipleDto } from './dto/read-multiple.dto';
import { IncreaseViewDto } from './dto/increase-view.dto';

@Injectable()
export class MediumService {
  browser: puppeteer.Browser;
  browserEdge: puppeteer.Browser;
  distanceToFooter: number;
  constructor() {}

  async readMultipleMedium(query: ReadMultipleDto) {
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
      await this.handleMedium(url, query?.timeReading);
    }
    await this.browser.close();
    return true;
  }

  async handleMedium(url: string, timeReading?: number) {
    const page = await this.browser.newPage();

    await page.goto(url);
    try {
      // claps
      await page.waitForSelector("[data-testid='headerClapButton']");

      // Click vào nút "headerClapButton"
      for (let i = 0; i < 50; i++) {
        await page.click("[data-testid='headerClapButton']");
      }
      // read article
      // Tìm phần tử footer trên trang web
      const footer = await page.$('footer');
      let distanceToFooter = 0;

      if (footer) {
        const footerBox = await footer.boundingBox();

        if (footerBox) {
          // Tính khoảng cách từ đầu trang đến footer
          distanceToFooter = footerBox.y;

          console.log(
            'Khoảng cách từ đầu đến footer: ' + distanceToFooter + ' pixel',
          );
        } else {
          console.log('Không thể tìm thấy kích thước và vị trí của footer.');
        }
      } else {
        console.log('Không thể tìm thấy phần tử footer trên trang web.');
      }

      const readTime = await page.evaluate(() => {
        const span = document.querySelector('[data-testid="storyReadTime"]');
        if (span) {
          return span.textContent.trim(); // Lấy nội dung và loại bỏ khoảng trắng
        }
        return null; // Trả về null nếu không tìm thấy thẻ span
      });

      const readTimeSeconds = timeReading
        ? timeReading
        : (Number(readTime?.split(' ')[0] || 1) * 60 * 1000) / 2;
      // Sử dụng page.evaluate để truyền chúng như một đối tượng
      await page.evaluate(
        (distanceToFooter, readTimeSeconds) => {
          return new Promise<void>((resolve) => {
            const totalHeight = distanceToFooter;
            const duration = readTimeSeconds;
            const stepHeight = 10;

            let distance = 0;
            const scrollInterval = setInterval(
              () => {
                window.scrollBy(0, stepHeight);
                distance += stepHeight;

                if (distance >= totalHeight) {
                  clearInterval(scrollInterval);
                  resolve();
                }
              },
              duration / (totalHeight / stepHeight),
            );
          });
        },
        distanceToFooter,
        readTimeSeconds,
      );
      console.log('Đã cuộn hết trang web.');

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
      page.close();
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

  async increaseViewArticle(increaseViewDto: IncreaseViewDto) {
    const { url, numberPlay, timeReading } = increaseViewDto;

    for (let i = 0; i < numberPlay; i++) {
      const options = {
        defaultViewport: null,
        args: ['--no-sandbox'],
        headless: false,
      };
      const browser = await puppeteer.launch(options);
      const page = await browser.newPage();
      try {
        await page.goto(url);

        await page.waitForTimeout(2000);

        // Tìm phần tử footer trên trang web
        const footer = await page.$('footer');
        let distanceToFooter = 0;

        if (footer) {
          const footerBox = await footer.boundingBox();

          if (footerBox) {
            // Tính khoảng cách từ đầu trang đến footer
            distanceToFooter = footerBox.y;

            console.log(
              'Khoảng cách từ đầu đến footer: ' + distanceToFooter + ' pixel',
            );
          } else {
            console.log('Không thể tìm thấy kích thước và vị trí của footer.');
          }
        } else {
          console.log('Không thể tìm thấy phần tử footer trên trang web.');
        }

        const readTime = await page.evaluate(() => {
          const span = document.querySelector('[data-testid="storyReadTime"]');
          if (span) {
            return span.textContent.trim(); // Lấy nội dung và loại bỏ khoảng trắng
          }
          return null; // Trả về null nếu không tìm thấy thẻ span
        });

        const readTimeSeconds = timeReading
          ? timeReading
          : (Number(readTime?.split(' ')[0] || 1) * 60 * 1000) / 2;
        // Sử dụng page.evaluate để truyền chúng như một đối tượng
        await page.evaluate(
          (distanceToFooter, readTimeSeconds) => {
            return new Promise<void>((resolve) => {
              const totalHeight = distanceToFooter;
              const duration = readTimeSeconds;
              const stepHeight = 10;

              let distance = 0;
              const scrollInterval = setInterval(
                () => {
                  window.scrollBy(0, stepHeight);
                  distance += stepHeight;

                  if (distance >= totalHeight) {
                    clearInterval(scrollInterval);
                    resolve();
                  }
                },
                duration / (totalHeight / stepHeight),
              );
            });
          },
          distanceToFooter,
          readTimeSeconds,
        );
        console.log('Đã cuộn hết trang web.');

        // Đợi một thời gian ngắn để thực hiện các thao tác khác nếu cần
        await page.waitForTimeout(2000);
        await browser.close();
      } catch (error) {
        await browser.close();
      }
    }

    return true;
  }

  async increaseViewArticleWithUserEdge(increaseViewDto: IncreaseViewDto) {
    const { url, numberPlay, timeReading } = increaseViewDto;
    if (!this.browserEdge) {
      const options = {
        headless: false,
        defaultViewport: null,
        executablePath:
          'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        userDataDir:
          'C:\\Users\\devho\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default',
      };
      console.log('numberPlay', numberPlay);
      this.browserEdge = await puppeteer.launch(options);
    }

    for (let i = 0; i < numberPlay; i++) {
      const page = await this.browserEdge.newPage();

      try {
        await page.goto(url);

        await page.waitForTimeout(1000);

        // Tìm phần tử footer trên trang web
        const footer = await page.$('footer');
        let distanceToFooter = 0;

        if (footer) {
          const footerBox = await footer.boundingBox();

          if (footerBox) {
            // Tính khoảng cách từ đầu trang đến footer
            distanceToFooter = footerBox.y;

            console.log(
              'Khoảng cách từ đầu đến footer: ' + distanceToFooter + ' pixel',
            );
          } else {
            console.log('Không thể tìm thấy kích thước và vị trí của footer.');
          }
        } else {
          console.log('Không thể tìm thấy phần tử footer trên trang web.');
        }

        const readTime = await page.evaluate(() => {
          const span = document.querySelector('[data-testid="storyReadTime"]');
          if (span) {
            return span.textContent.trim(); // Lấy nội dung và loại bỏ khoảng trắng
          }
          return null; // Trả về null nếu không tìm thấy thẻ span
        });

        const readTimeSeconds = timeReading
          ? timeReading
          : (Number(readTime?.split(' ')[0] || 1) * 60 * 1000) / 2;
        // Sử dụng page.evaluate để truyền chúng như một đối tượng
        await page.evaluate(
          (distanceToFooter, readTimeSeconds) => {
            return new Promise<void>((resolve) => {
              const totalHeight = distanceToFooter;
              const duration = readTimeSeconds;
              const stepHeight = 10;

              let distance = 0;
              const scrollInterval = setInterval(
                () => {
                  window.scrollBy(0, stepHeight);
                  distance += stepHeight;

                  if (distance >= totalHeight) {
                    clearInterval(scrollInterval);
                    resolve();
                  }
                },
                duration / (totalHeight / stepHeight),
              );
            });
          },
          distanceToFooter,
          readTimeSeconds,
        );
        console.log('Đã đọc hết. Lần thứ' + i);
        await page.close();
        // Đợi một thời gian ngắn để thực hiện các thao tác khác nếu cần
      } catch (error) {
        console.log(error);

        await this.browserEdge.close();
      }
    }
    await this.browserEdge.close();
    return true;
  }
}
