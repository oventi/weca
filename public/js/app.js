var addthis_share = {
   url: "http://sydneyworkexploitation.com/",
   title: "Report anonymously work #exploitation in Sydney #Australia"
};

danta.app(function () {
    var self = this;
    var weca = null;
    var widgets = {};

    var base_report = { business: '', location: '', score: 50 };

    self.init = function () {
        weca = danta.modules.weca;

        // create table widgets
        $('div[data-widget="Table"]').each(function () {
            var id = $(this).attr('id');
            widgets[id] = new danta.ui.widget.Table($(this));
        });

        // danta.router.parts[0] === 'admin'
        if(danta.router.parts[0] === 'admin') {
            load_admin();
        }
        else {
            // sets handlers for activating cards and the back button
            activate_and_back();

            // report button
            $('#report_card form button.submit').click(self.report);

            // load fair and unfair businesses
            load_fair();
            load_unfair();
        }
    }

    self.report = function () {
        var report = Object.create(base_report);

        var fields = $('#report_card form input[type=text]');
        fields.each(function () {
            report[$(this).attr('name')] = $(this).val();
        });

        $('#report_card form button.submit').hide();
        $('#report_card .ajaxload').show();
        weca.report(report, function (err, insertId) {
            if(!err) {
                $('#report_card .alert').text('Thanks for reporting!');
                $('#report_card .alert').show();
                setTimeout(function () { $('#report_card .alert').fadeOut('slow'); }, 2000);

                $('#report_card .ajaxload').hide();
                $('#report_card form input[type=text]').val('');
                $('#report_card form button.submit').show();
            }
            else {
                throw err;
            }
        });
    }

    var activate_and_back = function () {
        $('button.activate_card').click(function () {
            // hide actions
            $('div.actions').hide();

            var card_id = $(this).attr('id') + '_card';
            load_card(card_id);
        });

        $('div.back').click(function () {
            $('div.card').hide();

            toggle_back();

            $('.title h1').text('Sydney Work Exploitation');
            // show actions
            $('div.actions').show();
        });
    }

    var toggle_back = function () {
        $('.header .back').toggle();
        $('.header .title').toggleClass('col-xs-offset-1');
    }

    var load_card = function (card_id) {
        var title = $('#' + card_id).data('title');
        $('.title h1').text(title);

        $('#' + card_id).show();
        toggle_back();
    };

    var load_fair = function () {
        var fair_businesses = null;

        weca.get_list({ score_gt: 75, sort_direction: -1 }, function(err, fair_businesses) {
            widgets.fair_businesses.add_header_row(['Name', 'Location']);
            fair_businesses.forEach(function (e) {
                widgets.fair_businesses.add_row([e.business, e.location]);
            });
        });

    }

    var load_unfair = function () {
        var unfair_businesses = null;

        weca.get_list({ score_lt: 50, sort_direction: 1 }, function(err, unfair_businesses) {
            widgets.unfair_businesses.add_header_row(['Name', 'Location', 'Status']);
            unfair_businesses.forEach(function (e) {
                var status = null, message = null;

                if(e.score < 25) {
                    status = 'alert-danger';
                    message = 'Exploiting workers';
                } else if(e.score > 25 && e.score <= 50) {
                    status = 'alert-warning';
                    message = 'Allegedly exploiting workers';
                }

                widgets.unfair_businesses.add_row([e.business, e.location, message], null, status);
            });
        });
    }

    var load_admin = function () {
        $('.actions').hide();

        weca.get_list(null, function(err, reports) {
            widgets.all_reports.add_header_row(['ID', 'Name', 'Location', 'Score', 'Status', 'Action']);
            reports.forEach(function (e) {
                var status = null, message = null;

                if(e.score < 25) {
                    status = 'alert-danger';
                    message = 'Exploiting workers';
                } else if(e.score > 25 && e.score <= 50) {
                    status = 'alert-warning';
                    message = 'Allegedly exploiting workers';
                } else if(e.score > 75) {
                    status = 'alert-success';
                    message = 'Not exploiting workers';
                }

                widgets.all_reports.add_row([e._id, e.business, e.location, e.score, message, ''], null, status);
            });

            $('#admin_card table tr').each(function () {
                $('th:first', $(this)).hide();
                $('td:first', $(this)).hide();

                $('td:last', $(this)).append($('<button data-score="100"><i class="fa fa-smile-o"></i></button>'));
                $('td:last', $(this)).append($('<button data-score="50"><i class="fa fa-question"></i></button>'));
                $('td:last', $(this)).append($('<button data-score="0"><i class="fa fa-frown-o"></i></button>'));
            });

            $('#admin_card table').on('click', 'button', function () {
                var id = $(this).parent().parent().children()[0].innerHTML;
                var score = $(this).data('score');

                weca.update_score({ id: id, score: score }, function () {
                    console.log(id, score);
                    window.location.reload();
                });
            });
        });

        load_card('admin_card');
        $('body').css('overflow', 'auto');
    }
});
