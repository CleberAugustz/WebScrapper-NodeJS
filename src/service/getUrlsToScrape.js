import config from "../config/config";
import datasource from "../config/datasource";

const db = datasource(config);

const modelPages = db.models.pages;

export function getUrlsToScrape(amount) {
  return new Promise((resolve, reject) => {
    modelPages
      .findAll({
        where: {
          read: 0,
        },
        limit: amount,
      })
      .then((urls) => {
        var urlsToReturn = [];

        for (let index = 0; index < urls.length; index++) {
          urlsToReturn.push({
            url: urls[index].url,
            id: urls[index].id,
          });
        }

        resolve(urlsToReturn);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
