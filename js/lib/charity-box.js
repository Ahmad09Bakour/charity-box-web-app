window.CharityBudgetList = {
    apiUrl: 'http://localhost:8083/charity-budget-items',

    addItem: function () {
        var description = $('#description-input').val();
        var location = $('#location-input').val();
        var deadline = $('#deadline-input').val();
        var note = $('#note-input').val();

        var data = {
            description: description,
            location: location,
            deadLine: deadline,
            done: false,
            note: note
        };

        $.ajax({url: CharityBudgetList.apiUrl,
        method: "POST",
            contentType: "application/json; charest=utf-8",
            data: JSON.stringify(data)
        }).done(function (response) {
            console.log('Successfully created an item.');
            console.log(response);

            CharityBudgetList.getItems()
        });
    },

    getItems: function () {

        $.ajax({url: CharityBudgetList.apiUrl,
        method: "GET"
        }).done(function (response) {
            CharityBudgetList.displayItem(JSON.parse(response));
        });
    },

    deleteItem: function (id) {

        $.ajax({url:CharityBudgetList.apiUrl,
        method:"DELETE"
        }).done(function () {

            CharityBudgetList.getItems();
        });
    },

    markItemDone: function (id, done) {
        $.ajax({url: CharityBudgetList.apiUrl + "?id" + id,
        method: "PUT",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({done: done})
        }).done(function () {
            CharityBudgetList.getItems();
        });
    },

    displayItem: function (items) {
        var tableBody = '';

        items.forEach(item => tableBody += CharityBudgetList.getTableRow(item));   // foreach method in js

        $('#items tbody').html(tableBody)
    },

    getTableRow: function (item) {
        var formattedDeadLine = new Date(item.deadline).toLocaleDateString("en-US");
        var checkedAttribute = item.done ? "checked" : ""; // item if(?) it was done then show "checked", if not (:) then show nothing
        // we got it from the html sheet from <tbody> and we add the $ etc
        return ` <tr>
        <td class="description">${item.description}</td>
        <td class="location">${item.location}</td>
        <td class="deadline">${formattedDeadLine}</td>
        <td><input type="checkbox" ${checkedAttribute} title="Done" class="mark_done" data-id="${item.id}"></td>
        <td><a herf="#" class="delete fas fa-trash-alt" data-id="${item.id}"></a></td>
        <td class="note">${item.note}</td>
    </tr>`
    },

    bindEvents: function () {
        $('#create-item').submit(function (event) {
            event.preventDefault();

            console.log('Form submitted.');

            CharityBudgetList.addItem();
            // return false
        });

        $('#items').delegate('.delete', 'click', function () {
            event.preventDefault();

            let id = $(this).data('id');
            CharityBudgetList.deleteItem(id);
        });

        $('#items').delegate('.mark_done', 'change', function () {

            let id = $(this).data('id');
            let done = $(this).is(":checked");

            CharityBudgetList.markItemDone(id, done);

        });
    }

};

CharityBudgetList.getItems();
CharityBudgetList.bindEvents();