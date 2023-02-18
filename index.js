const axios = require("axios");
const cheerio = require("cheerio");
const ejs = require("ejs");
const express = require("express");

const app = express();

app.get("/", async (req, res) => {
  const response = await axios.get("https://helion.pl/kategorie/big-data", {
    headers: {
      "Content-Type": "text/html; charset=UTF-8"
    }
  });
  const $ = cheerio.load(response.data);

  const books = [];
  $(".book-list-inner > .list > .classPresale").each((i, el) => {
    const title = $(el).find('.short-title').text();
    const rawPrice = $(el).find('.price > a > ins > span').text();
    const altPrice = $(el).find('.price > a > span').text();
    const buyLink = $(el).find('.price > a').attr('href');
    const img = $(el).find('.cover > .lazy').attr('data-src');

    let price = rawPrice ? rawPrice : altPrice;
    books.push({
      title,
      price,
      buyLink,
      img
    });
  });

  const html = await ejs.renderFile(__dirname + "/views/index.ejs", { books });
  res.send(html);
});

app.listen(3000, () => console.log("Serwer działa na porcie 3000.\nhttp://localhost:3000"));
