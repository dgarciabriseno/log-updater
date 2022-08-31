(() => {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;
  let iframe = document.getElementsByTagName('iframe')[0].contentDocument;
  let editor = iframe.getElementById('tinymce');
  let rows = editor.getElementsByTagName('tr');
  let header_row = rows[2];

  function insert_row(date, text, charge, hours) {
    let date_td = document.createElement('td');
    date_td.textContent = date;

    let text_td = document.createElement('td');
    text_td.innerHTML = text.replace("\n", "<br/>");

    let charge_td = document.createElement('td');
    charge_td.innerHTML = charge.replace("\n", "<br/>");

    let hours_td = document.createElement('td');
    hours_td.textContent = hours;

    let tr = document.createElement('tr');
    tr.appendChild(date_td);
    tr.appendChild(text_td);
    tr.appendChild(charge_td);
    tr.appendChild(hours_td);

    console.log(tr);
    header_row.insertAdjacentElement('afterend', tr);
  }

  /**
   * Listen for messages from the background script.
   * Call "insertBeast()" or "removeExistingBeasts()".
   */
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "update_table") {
        insert_row(message.date, message.text, message.charge, message.hours);
    }
  });
})();

