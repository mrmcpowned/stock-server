const request = require('sync-request')
const cheerio = require('cheerio')
const moment = require('moment')

let getLinks = (ticker) => {
  let url=`https://www.fool.com/quote/${ticker}`;
  let html = request('GET', url);

  let $ = cheerio.load(html.getBody());

  let linkGroups = $('#article-list .article-link');

  links = []

  for (let i = 0; i < linkGroups.length; i++){
    links.push(linkGroups[i].attribs.href);
  }

  if(links.length > 10)
    links = links.splice(0,10)

  return links;

}

let getArticle = (link) => {
  let html = request('GET', link);

  let $ = cheerio.load(html.getBody());

  let article = $('#main-content .article-body .article-content');

  article.find('.ad').remove();

  let articleBody = article.text().trim();

  let title = $('h1').text().trim();

  let date = $('.publication-date').text().trim()

  date = moment(date, 'MMM D, YYYY at h:Ha').unix();

  let firstParagraph = article.find('p:first-of-type').text().trim()

  return {
    title,
    date,
    firstParagraph,
    articleBody
  }

}