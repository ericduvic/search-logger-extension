import Search from "./Search.js";

const CSV_MIMETYPE = "data:text/csv;charset=utf-8,";
const current_date = new Date();

const download_button = document.getElementById("download-csv");
const from_input = document.getElementById("from-date");
const to_input = document.getElementById("to-date");
from_input.setAttribute(
  "max",
  current_date.toLocaleDateString("en-GB").split("/").reverse().join("-")
);
to_input.setAttribute(
  "max",
  current_date.toLocaleDateString("en-GB").split("/").reverse().join("-")
);

download_button.addEventListener("click", () => {
  let from_date = new Date(from_input.valueAsNumber);
  if (isNaN(from_date)) {
    from_date = current_date;
  }
  let to_date = new Date(to_input.valueAsNumber);
  if (isNaN(to_date)) {
    to_date = new Date(current_date);
  }
  from_date.setHours(0, 0, 0, 0);
  to_date.setHours(0, 0, 0, 0);
  to_date.setDate(to_date.getDate() + 1);
  from_date = Math.floor(from_date.getTime() / 1000);
  to_date = Math.floor(to_date.getTime() / 1000);
  console.log(from_date, to_date);

  chrome.storage.local.get({ searchLogs: [] }, (data) => {
    let searches = [];
    for (let searchLog of data.searchLogs) {
      if (searchLog.timestamp < from_date || searchLog.timestamp > to_date)
        continue;
      searches.push(
        new Search(
          searchLog.url,
          searchLog.search_terms,
          searchLog.timestamp,
          searchLog.metadata
        )
      );
    }
    console.log(searches);
    let csv_document = CSV_MIMETYPE;
    csv_document = csv_document + ["time", "search terms", "\r\n"].join("|");
    searches.map((search) => {
      let row = [
        new Date(search.timestamp * 1000).toString(),
        search.search_terms,
        "\r\n",
      ].join("|");
      csv_document = csv_document + row;
    });
    chrome.downloads.download({
      filename: "testdata_" + Date.now() + ".csv",
      saveAs: true,
      url: csv_document,
    });
  });
});
