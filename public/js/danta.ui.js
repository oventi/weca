danta.ui = {
    Widget: function () {

    },

    widget: {
        Table: function ($jo) {
            $jo.empty();
            var $table = $('<table class="table table-bordered"/>').hide();
            $jo.append($table);

            this.add_header_row = function (row) {
                this.add_row(row, 'header');
            }

            this.add_row = function (row, type, css_class) {
                var cell = type === 'header' ? '<th/>' : '<td/>';
                var $tr = $('<tr/>').addClass(css_class);

                for(var i = 0; i < row.length; i++) {
                    $tr.append($(cell).text(row[i]));
                }

                $table.append($tr);
                $table.show();
            }

            this.empty = function () {
                $jo.empty();
            }
        }
    }
};
