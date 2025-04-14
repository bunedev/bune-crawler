import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { ReadMultipleDto } from './dto/read-multiple.dto';
import { IncreaseViewDto } from './dto/increase-view.dto';
import { getRandomUSLocation } from 'src/common/helper';

@Injectable()
export class MediumService {
  browser: puppeteer.Browser;
  browserEdge: puppeteer.Browser;
  distanceToFooter: number;
  count: number;
  constructor() {
    this.count = 0;
  }

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
          'C:\\Users\\kien\\AppData\\Local\\Google\\Chrome\\User Data\\Default',
      };
      this.browser = await puppeteer.launch(options);
    }
    const promises = [];
    for (const url of listUrl) {
      promises.push(this.handleMedium(url, query?.timeReading));
    }
    await Promise.all(promises);
    await this.browser.close();
    this.browser = null;
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
            const stepHeight = 5;

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
      'Thank you for sharing your insights. Reading your article was the highlight of my day. Your depth of understanding on this subject shines through in your detailed analysis and engaging writing style.',
      "I'm genuinely impressed by the clarity and depth of your article. It’s evident that a lot of research and thought went into this, and I learned a great deal from your nuanced perspective.",
      'This was an incredibly informative read. You have a unique ability to discuss complex topics in a way that’s both accessible and engaging. Looking forward to your next piece!',
      "Your writing never fails to engage me. This article is no exception. The way you've structured your arguments and supported them with evidence is commendable.",
      'What a refreshing take on a topic that I thought had been covered in every possible way. Your fresh perspective and detailed explanations have provided me with a lot to ponder.',
      "Excellent work on this article. Your in-depth knowledge and passion for the subject matter come through in every paragraph. It's a pleasure to read content that is both informative and well-crafted.",
      "I must commend you on your eloquent writing and the comprehensive coverage of the topic. It's rare to find such a well-rounded piece that provides such a thorough understanding.",
      "Your article was a real eye-opener for me. The level of detail you provide and the engaging way in which you present your points is exceptional. I'm eagerly anticipating your future articles.",
      'You have a remarkable talent for explaining complex issues in a clear and thought-provoking manner. This article is a testament to that talent, and I feel much more informed having read it.',
      "I'm thoroughly impressed by the depth of your article. The way you've dissected the topic and presented your viewpoints is exemplary. It's content like this that keeps me coming back to Medium.",
      'I came for knowledge, but stayed for the vibe. 🔥',
      'Did you just drop wisdom or was that a mic? 🎤',
      'This article just upgraded my brain’s firmware. 🤯',
      'Why is this free? I feel like I owe you coffee money now. ☕💸',
      'Medium should start charging extra for content this good.',
      'Your brain needs to be protected at all costs.',
      'Teach me, Sensei. 🥋',
      'I didn’t read this — I *consumed* it. Like a hungry dragon.',
      'If this were a dish, it would be 3 Michelin stars. 🍽️✨',
      'This is the kind of article that makes me rethink my entire life. In a good way.',
      'You just hit me with facts, humor, and inspiration. Triple combo!',
      'Okay, now you *have* to write a book. I’ll preorder.',
      'I want to print this and tape it to my mirror.',
      'How is this better than my university course?',
      'Brain = blessed. Mood = uplifted. Eyes = opened.',
      'Loved this so much. Can we be friends?',
      'Following immediately — this kind of writing is rare!',
      'This article found me exactly when I needed it.',
      'Thank you for putting this into words. You’re doing the Lord’s work.',
      'Your writing voice is so refreshing. Please don’t stop.',
      'This is the Medium equivalent of a warm hug.',
      'Can I bookmark this and read it every Monday?',
      'I didn’t know I needed this until now.',
      'You just made my day 100x better.',
      'This should be required reading. Everywhere.',
      'SLAYED. Literally ate and left no crumbs. 💅🔥',
      'Big brain energy detected. 💡👀',
      'Who gave you the right to be this insightful?!',
      'Okay now I feel called out but in the best way.',
      'Respectfully… I’m obsessed with your writing.',
      'This article is giving ✨main character energy✨.',
      'Medium? More like Max-imum value. 😎',
      'This made my ADHD brain feel seen. I am emotional.',
      'I read this once and I’m already more emotionally intelligent.',
      'This should be on Netflix as a docuseries.',
      'You’ve articulated what so many of us feel but can’t explain.',
      'This connected so many dots for me.',
      'Sometimes you read something and it just *clicks.* This is one of those times.',
      'This wasn’t just a good article. It was a mirror.',
      'I wish I had this insight 5 years ago — but I’m glad I found it today.',
      'Your words have weight. Thank you for sharing them.',
      'I read this slowly, just to make it last longer.',
      'This is not just writing. It’s art.',
      'Saved, shared, and re-read. This is gold.',
      'You didn’t write a blog post. You wrote a breakthrough.',
      'Whew. That hit home.',
      'Can’t stop nodding while reading.',
      'This belongs on every ‘must-read’ list.',
    ];

    // Chọn ngẫu nhiên một phương án khen bài từ mảng
    const randomIndex = Math.floor(Math.random() * praiseComments.length);
    const randomComment = praiseComments[randomIndex];

    return randomComment;
  }

  async increaseViewArticleWithUserChrome(increaseViewDto: IncreaseViewDto) {
    const { url, numberPlay, timeReading, session } = increaseViewDto;
    const promises = [];
    for (let i = 0; i < session; i++) {
      promises.push(this.increaseViewArticle(increaseViewDto));
    }
    await Promise.all(promises);
    return true;
  }

  async increaseViewArticle(increaseViewDto: IncreaseViewDto) {
    const { url, numberPlay, timeReading, maxTimeReading } = increaseViewDto;
    for (let i = 0; i < numberPlay; i++) {
      const options = {
        headless: false,
        defaultViewport: null,
        ignoreDefaultArgs: ['--disable-extensions'],
      };
      const browser = await puppeteer.launch(options);
      const context = await browser.createIncognitoBrowserContext();
      await context.overridePermissions(url, ['geolocation']);
      const page = await context.newPage();
      const location = getRandomUSLocation();
      await page.setGeolocation(location);
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
        console.log('maxTimeReading', maxTimeReading);
        console.log('timeReading', timeReading);

        const timeRedingArticle =
          (Math.floor(Math.random() * (maxTimeReading - timeReading)) +
            timeReading) /
          100000;
        console.log('timeRedingArticle', timeRedingArticle);

        const readTimeSeconds = timeRedingArticle
          ? timeRedingArticle
          : (Number(readTime?.split(' ')[0] || 1) * 60 * 1000) / 2;
        console.log('readTimeSeconds', readTimeSeconds);
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

  async increaseViewArticleWithUserEdge(increaseViewDto: IncreaseViewDto) {
    const { url, numberPlay, timeReading } = increaseViewDto;
    if (!this.browserEdge) {
      const options = {
        headless: false,
        defaultViewport: null,
        executablePath:
          'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        userDataDir:
          'C:\\Users\\kien\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default',
      };
      console.log('numberPlay', numberPlay);
      this.browserEdge = await puppeteer.launch(options);
    }

    for (let i = 0; i < numberPlay; i++) {
      const context = await this.browserEdge.createIncognitoBrowserContext();
      const page = await context.newPage();

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
        this.count++;
        console.log('Tổng số lần: ', this.count);
        await page.close();
        // Đợi một thời gian ngắn để thực hiện các thao tác khác nếu cần
      } catch (error) {
        console.log(error);

        await this.browserEdge.close();
      }
    }
    await this.browserEdge.close();
    this.browserEdge = null;
    return true;
  }

  async login(urlLogin: string) {
    try {
      if (!this.browser) {
        // Khởi động trình duyệt nếu chưa tồn tại
        const options = {
          headless: false,
          defaultViewport: null,
          executablePath:
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          userDataDir:
            'C:\\Users\\kien\\AppData\\Local\\Google\\Chrome\\User Data\\Default',
        };
        this.browser = await puppeteer.launch(options);
      }
      const page = await this.browser.newPage();

      await page.goto(urlLogin);
      this.browser = null;
    } catch (error) {
      console.log(error);
      this.browser = null;
    }
  }
}
