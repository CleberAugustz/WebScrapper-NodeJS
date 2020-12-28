import config from "../config/config";
import datasource from "../config/datasource";
import request from "request-promise";
import cheerio from "cheerio";

const db = datasource(config);

const modelProducts = db.models.products;
const modelPages = db.models.pages;

export function requestBody(url) {
  return new Promise((resolve, reject) => {
    const options = {
      url,
      transform: function (body) {
        return cheerio.load(body);
      },
    };

    request
      .get(options)
      .then(($) => {
        $(process.env.BODY).each(function () {
          var url = $(this).find(process.env.URL).attr("href");
          var name = $(this).find(process.env.NAME).text();

          var shipping = $(this).find(process.env.SHIPPING).first().text();

          let decimal = $(this).find(process.env.DECIMAL).first().text();
          let price = $(this).find(process.env.PRICE).first().text();

          price =
            price.replace(".", "") + (decimal != "" ? "." + decimal : ".00");

          modelProducts.findOne({ where: { url } }).then((product) => {
            if (product == null) {
              let newProduct = {
                url,
                name,
                price,
                decimal,
                shipping,
              };

              modelProducts.create(newProduct);
            }
          });
        });

        $(process.env.PAGINATION).each(function () {
          const url = $(this).find("a").attr("href");

          if (url != "#") {
            modelPages.findOrCreate({ where: { url } });
          }
        });

        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}
