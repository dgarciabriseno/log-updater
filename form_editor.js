(() => {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }

  function add_newline(el) {
      let br = document.createElement('br');
      el.appendChild(br);
  }

  function add_span(el, text) {
      let span = document.createElement('span');
      span.textContent = text;
      el.appendChild(span);
  }

  function add_text(el, text) {
      let lines = text.split('\n');
      for (const line of lines) {
          add_span(el, line);
          add_newline(el);
      }
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
    add_text(text_td, text);

    let charge_td = document.createElement('td');
    add_text(charge_td, charge)

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

