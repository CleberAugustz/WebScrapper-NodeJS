import interval from "interval-promise";
import {
  getUrlsToScrape,
  requestBody,
  updatePageScraped,
} from "./service/index";

async function main() {
  try {
    const pagesToScrape = await getUrlsToScrape(3);

    if (pagesToScrape.length > 0) {
      for (let index = 0; index < pagesToScrape.length; index++) {
        const page = pagesToScrape[index];
        console.log(page.url);
        await requestBody(page.url);
        await updatePageScraped(page.id);
        console.log("Página lida com sucesso.\n");
      }
    } else {
      console.log("Não existem novas urls disponíveis.\n");
    }
  } catch (error) {
    console.log(error);
  }
}

interval(async () => {
  await main();
}, 10000);
