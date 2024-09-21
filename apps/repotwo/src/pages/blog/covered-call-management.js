import React from "react";
import Head from "next/head";
import styles from "@styles/Blog.module.css";
import Link from "next/link";
import { Meta } from "@atoms/Meta";

const coveredCallMangement = () => {
  function addProductJsonLd() {
    return {
      __html: `
      {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": "This Covered Call Management Lesson saved me $10,000s",
        "description": "Trading covered calls, cash secured puts, the wheel strategy, covered strangle or any strategy that your goal in mind is to get income from trading options... then you are going to want to listen up to what I am saying in this video",
        "thumbnailUrl": "https://i9.ytimg.com/vi_webp/yUtSUgdQ4yk/mqdefault.webp?v=631f5681&sqp=COzq65kG&rs=AOn4CLApWosuOawERbufcuRLx28EJXjvEQ",
        "uploadDate": "2022-09-21"
      }
      `,
    };
  }
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={addProductJsonLd()}
          key="product-jsonld"
        />
      </Head>
      <Meta
        title="This Covered Call Management Lesson saved me $10,000s"
        type="blog"
        url="https://optionscout.com/blog/covered-call-management"
        imge="https://i.ytimg.com/vi/yUtSUgdQ4yk/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBdiwGRNd5-6xMlvdbjBJ5rTLxF9w"
        description="Lessons learned from managing a portfolio of covered calls, this can work for other income options strategies."
        keywords="trading covered calls, managing covered calls, covered calls trading"
      />
      <div className={styles.paddingBlog}>
        <div>
          <div className={styles.markdownText}>
            <h1>This Covered Call Management Lesson saved me $10,000s</h1>
          </div>
          <div className={styles.markdownText}>
            <h3>Don&apos;t want to read? Checkout the video version: </h3>
          </div>
        </div>
        <div>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/yUtSUgdQ4yk"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className={styles.markdownText}>
          <p>
            If your goal is to collect income from selling options then you are
            going to want to understand a few key points
          </p>
          <br />
          <ol>
            <li>
              Sometimes the best thing to do, is to do nothing. (Hint: wait for
              the market to swing)
            </li>
            <li>Adjustments can lead to a higher return on investment</li>
            <li>
              In many cases, setting a goal of less income, but higher
              probability may be better.
            </li>
          </ol>
        </div>
        <div className={styles.markdownText}>
          <p>
            The video above addresses the first point, in detail, but I will
            cover it here as well and the additional points
          </p>
        </div>
        <div className={styles.markdownText}>
          <h2>Sometimes the best thing to do, is to do nothing</h2>
        </div>
        <div className={styles.markdownText}>
          <p>
            As a covered call seller, you might get a bit anxious when your
            stock starts to go below your purchase cost. For me, this sometimes
            felt embrassing because of the excitement of selling call,
            collecting the income, and thinking of all the future premiums to
            collect. But dissapointed once I do the math and now realize that I
            am losing much more from the stock going down.
          </p>
          <p>
            FIRST OFF, be okay with that and actually realize that you are now
            out performing that stock.
            <br />
            You would of been worse off by doing nothing, so congrats!
          </p>
          <p>
            SECOND OFF, you should ask yourself a few questions, such as:
            <br />
          </p>
        </div>
        <div className={styles.markdownText}>
          <h4>
            Question 1: Is your goal to own this stock for the long term?{" "}
          </h4>
          <p>
            If your goal is to own the stock for the long term, because you are
            interested in capital gains or maybe also the dividend, then it just
            would not make sense to try to sell calls when you have a risk of
            selling your positions at break even, or even a loss.
            <br />
            You believe in the stock, so sometimes the best thing to do, is just
            take a break from selling calls and wait for the stock to rebound.
            You could sell calls at your target price, but you may be collecting
            pennies, which if that is okay for you then great!
          </p>
        </div>
        <div className={styles.markdownText}>
          <h4>
            Question 2: Does this stock (or index) have a history of performing
            well?{" "}
          </h4>
          <p>
            This is a no brainer if you are trading covered calls on index that
            track the S&P 500 or NASDAQ 100.
            <br />
            These assets have a history of going up in price, so if that is the
            case, does it make sense to collect maybe 1-2% in premium at the
            risk of the index historically performing a 9% return?
          </p>
        </div>
        <div className={styles.markdownText}>
          <h4>
            Question 3: Is the stock tanking? or is the market just correcting?{" "}
          </h4>
          <p>
            If you are trading an invidual stock and not an index, you should do
            a couple things. First off, zoom out. See how your stock compares to
            the overall market. Second off, check how your stock is doing
            compared to the overall market. If the market is correcting and so
            is your stock, there is not much to worry about, it&apos;s just a
            typically market correction.
          </p>
        </div>
        <div className={styles.markdownText}>
          <p>
            These questions are important because after asking yourselves these
            and thinking through, you may just realize that the best thing to
            do, is just wait it out before selling options.
          </p>
        </div>
        <br />
        <div className={styles.markdownText}>
          <h2>Adjusting call options to maintain consistent probability</h2>
          <p>
            A strategy to implement is sticking to your same probability of
            profit. What this really means, is you will adjust down. Yes, you
            will be making a less max profit, but investors who possible want to
            get out of the stock anyway, possible because they are already close
            to their target price.
          </p>
          <p>Here is an example</p>
          <ul>
            <li>You bought XYZ stock at $125, 1 month ago </li>
            <li>
              The stock has risen to $130, so you sell a 1 week call with a
              strike price of $135 and collect $50
            </li>
            <li>
              All of a sudden the stock corrects to $120, your 2 week option is
              now worth pennies.
            </li>
            <li>
              You use an{" "}
              <Link href="https://optionscout.com/option-calculator" passHref>
                options profit calculator
              </Link>
              and find out that your call option now has a 90% chance of
              expiring worthless, but it started off at 75%
            </li>
            <li>
              You then play around with the options calculator and find out you
              can sell a $125 strike to collect $50 again, this option also has
              75% chance of expiring worthless.
            </li>
            <li>
              So now, you should be maintaining the same return on investment,
              however you are limiting your max profit
            </li>
          </ul>
        </div>
        <br />
        <div className={styles.markdownText}>
          <h2>Writing LEAPs for a roll out strategy</h2>
          <p>
            An interesting strategy to implement if you really want to collect
            income, but also want to keep at your target price. Is to far out in
            time and sell a 6 months, 1 year or maybe even 2 year call option.
          </p>
          <p>
            This won&apos;t give you a high return on investment compared to
            selling weeklies, but it will give you the most amount of income
            that you could get in exchange of sticking with your target price.{" "}
          </p>
          <p>This can be great for investors who want to keep it passive</p>
          <p>Here is an example</p>
          <ul>
            <li>You bought XYZ stock at $100, 1 year ago </li>
            <li>
              The stock has risen to $130, so you sell a 2 week call with a
              strike price of $132 and collect $300
            </li>
            <li>
              All of a sudden the stock corrects to $120, your 2 week option is
              now worth pennies.
            </li>
            <li>
              You check an options chain and realize you are going to be getting
              little income for selling any short term options at your $132
              target price
            </li>
            <li>
              You find out, that a 1 year leap is trading for $4.00, so you sell
              it and collect $400.
            </li>
          </ul>
        </div>

        <div className={styles.markdownText}>
          <p>
            To visualize your covered call strategy, head over to our{" "}
            <Link
              href="https://optionscout.com/option-calculator/covered-call"
              passHref
            >
              Covered Call Calculator
            </Link>
            so that you can see your max profit, compare strike prices, see
            probability of profit and all other important factors when making an
            options trade.
          </p>
        </div>
      </div>
    </>
  );
};

export default coveredCallMangement;
