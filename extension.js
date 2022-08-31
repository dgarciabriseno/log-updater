function store_charge_code_and_hours() {
    let code = document.getElementById('charge').value;
    let hours = document.getElementById('hours').value;
    let result = {
        data: {
            charge: code,
            hours: hours
        }
    };
    browser.storage.local.set(result);
}

async function restore_charge_code_and_hours() {
    let data = await browser.storage.local.get('data');
    data = data.data;
    if (data.hasOwnProperty('charge')) {
        document.getElementById('charge').value = data.charge;
        document.getElementById('hours').value = data.hours;
    }
}

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

document.getElementById('date').value = new Date().toDateInputValue();
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {restore_charge_code_and_hours();}, 100);
});
/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs
  .executeScript({ file: "form_editor.js" })
  .then(() => {
      // When you click the "Update" button, send a message to the tab to execute
      // the update_table command
      document.getElementById('submit').addEventListener('click', () => {
          store_charge_code_and_hours();
          browser.tabs
        .query({ active: true, currentWindow: true })
        .then((tabs) => {
          browser.tabs.sendMessage(tabs[0].id, {
              command: "update_table",
              date: document.getElementById('date').value,
              text: document.getElementById('text').value,
              charge: document.getElementById('charge').value,
              hours: document.getElementById('hours').value
          });
        })

      });
  });

