const Application = require('./lib/application.js');
main();

async function main() {
  const app = await new Application(['usd', 'gbp', 'eur', 'pln']);
  const serialized = await app.serialize();

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    chrome.tabs.sendMessage(tabId, {
      action: 'doCurrencyConversion',
      application: serialized,
    });
  });
};
