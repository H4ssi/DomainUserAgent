/*
 * I use this thing as a dictionary
 **/
var domains = {};


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

    var addRowHtml = '<table><tbody><tr><td><input class="domain"></td><td><input class="userAgent"></td><td><button>Add</button></td></tr></tbody></table>';

    var addRow = toDOM(addRowHtml, 'tr');

    addRow.querySelector('button').addEventListener('click', function() {
        var domain = addRow.querySelector('.domain').value;
        var userAgent = addRow.querySelector('.userAgent').value;
        addDomainToSettings(domains, domain, userAgent);
        createTable();
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
