import config from "../config/config";
import datasource from "../config/datasource";

const db = datasource(config);

const modelPages = db.models.pages;

export function updatePageScraped(id) {
  return new Promise((resolve, reject) => {
    modelPages
      .findOne({ where: { id } })
      .then((urlScraped) => {
        urlScraped.read = true;
        urlScraped.save();

        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}
