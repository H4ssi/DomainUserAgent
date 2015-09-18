/*
 * I use this thing as a dictionary
 **/
var domains = {};

var userAgentsSelect = '<select class="userAgentSelect">'
 + '<option value="Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)">IE 10</option>'
 + '<option value="Mozilla/5.0 (X11; Linux x86_64; rv:40.0) Gecko/20100101 Firefox/40.0">Firefox</option>'
 + '<option value="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36">Chrome</option>'
 + '<option value="" selected>Custom</option>'
 + '</select>';

/*
 * Deletes the item with the given key from the dictionary
 * then reloads the table and stores the settings
 **/
function delItem(key) {
    delete domains[key];
    chrome.storage.sync.set({'domains': domains});
    createTable();
}

function toDOM(html, selector) {
    var parser = new DOMParser();

    return parser.parseFromString('<!DOCTYPE html><html><body>' + html + '</body></html>', 'text/html').querySelector(selector);
}

function appendRow(table, domain, userAgent) {
    var rowHtml = '<table><tbody><tr><td>'+domain+'</td><td>'+userAgent+'</td><td><button>Remove</button></td></tr></tbody></table>';

    var row = toDOM(rowHtml, 'tr');

    row.querySelector('button').addEventListener('click', function() { delItem(domain); });

    table.querySelector('tbody').appendChild(row);
}

/**
 * Creates the HTML table to put inside the options page
 **/
function createTable() {
    var tableHtml = "<table><thead><tr><th>Domain</th><th>User Agent</th><td></td></tr></head><tbody></tbody></table>";

    var table = toDOM(tableHtml, 'table');
    
    var tableDiv = document.getElementById("tablediv");
    
    tableDiv.replaceChild(table, tableDiv.firstChild);

    var domainNames = Object.keys(domains).sort();
    
    domainNames.forEach(function (domain) {
        appendRow(table, domain, domains[domain]);
    });

    var addRowHtml = '<table><tbody><tr><td><input class="domain"></td><td>'+userAgentsSelect+'<input class="userAgent"></td><td><button>Add</button></td></tr></tbody></table>';

    var addRow = toDOM(addRowHtml, 'tr');

    var domain = addRow.querySelector('.domain');
    var userAgentSelect = addRow.querySelector('.userAgentSelect');
    var userAgent = addRow.querySelector('.userAgent');
    var button = addRow.querySelector('button');

    button.addEventListener('click', function() {
        addDomainToSettings(domains, domain.value, userAgent.value);
        createTable();
    });
    userAgentSelect.addEventListener('change', function() {
        userAgent.value = userAgentSelect.value;
    });
    userAgent.addEventListener('input', function() {
        userAgentSelect.value = ''; // reset to "custom"
    });

    table.querySelector('tbody').appendChild(addRow);
}

chrome.storage.sync.get(null,
    function (result) {
        domains = result.domains;
        if (domains == undefined) {
            domains = {};
        }
        createTable();
    }
);
