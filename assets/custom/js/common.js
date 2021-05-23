(function($) {
    $.fn.validatePattern = function(search) {
        // Get the current element's siblings
        var pattern = this.attr('pattern');
        var value = this.val();
        return !(pattern && (value.length > 0) && !value.match(new RegExp('^' + pattern + '$')));
    };

    $.fn.getUrlParameter = function(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };
})(jQuery);


$(document).on('keyup', ':input', function(e) {
    e.preventDefault();
    if (!$(this).validatePattern()) {
        $(this).closest('.form-group').removeClass('has-error has-warning has-success');
        $(this).closest('.form-group').addClass('has-error');
        $(this).closest('.form-group').find('.help-block').removeClass('hidden');
    } else {
        $(this).closest('.form-group').removeClass('has-error has-warning has-success');
        $(this).closest('.form-group').find('.help-block').addClass('hidden');

    }
});

function show_message(m_type, message_text, message_data = [], reload = false) {
    console.log(m_type, message_text, message_data);
    if (m_type !== undefined) {
        switch (m_type.toLowerCase()) {
            case 'error':
            case 'danger':
            case 'fail':
                n_type = 'danger';
                n_title = 'Error';
                n_icon = 'fa fa-times';
                n_color = '#d33724';
                break;
            case 'warning':
                n_type = 'warning';
                n_title = 'Warning';
                n_icon = 'fa fa-warning';
                n_color = '#db8b0b';
                break;
            case 'info':
                n_type = 'info';
                n_title = 'Information';
                n_icon = 'fa fa-info';
                n_color = '#00a7d0';
                break;
            case 'success':
                n_type = 'success';
                n_title = 'Success';
                n_icon = 'fa fa-check';
                n_color = '#008d4c';
                break;
            default:
                n_type = m_type;
                n_title = 'Error';
                n_icon = 'fa fa-chain-broken';
                n_color = '#d33724';
                break;

        }
    } else {
        n_type = 'danger';
        n_title = 'Error';
    }

    if (typeof timeout_message !== 'undefined') {
        window.clearTimeout(timeout_message);
    }
    timeout_message = setTimeout(function() {
        hide_message();
    }, 1000000);

    var reload_btn_class = ' na ';
    if (reload == true) {
        reload_btn_class = "reload_page";
    }
    $('#im_n').modal('show');
    $("#im_n").removeClass("modal-info modal-default modal-warning modal-success modal-primary modal-danger").addClass("modal-" + n_type);
    $("#imstyle_n").removeClass("modal-sm modal-md modal-lg").addClass("modal-lg");
    $("#imtitle_n").html(n_title);
    $("#imbody_n").html('<div class="modal-body" id="im_body" style="height:90%" ><div class="icon_box" style="font-size:128px;padding:25px;background:white;color:' + n_color + ';border-radius:10px;margin:10px;"><i class="' + n_icon + '"></i></div><div class="n_message" style="margin-top:10px;"><hr>' + message_text + '<hr><table class="table n_message_data"></table></div></div><div class="modal-footer" id="im_footer_n" ><button data-dismiss="modal" class="btn btn-brand btn-block text-center ' + reload_btn_class + '">OK</button></div></div>');
    console.log(typeof message_data);
    $.each(message_data, function(key, val) {
        col = $('<tr style="height: 42px;color: #fff;font-weight: 600;"><td>' + key + '</td><td>' + val + '</td></tr>');
        $(col).appendTo('.n_message_data');
    });

}

function hide_message() {
    $('#ermsgscreen').html('').attr('class', '');
    $('#ermsgscreen').hide();
    $('#im_n').modal('hide');
}

var divloader = '<div class="overlay"><i class="fa fa-spinner fa-spin fa-fw"></i></div>';
var spinner = $('#loader');

function get_browser() {
    var ua = navigator.userAgent,
        tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR|Edge\/(\d+)/)
        if (tem != null) { return { name: 'Opera', version: tem[1] }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
}

var browser = get_browser(); // browser.name = 'Chrome'
// browser.version = '40'

var EP_data = 'data/data?end_channel_code=LoanApplication&userAgent=' + browser.name + '&userAgentVersion=' + browser.version + '&';

function getData(formData) {
    var response_data;
    hide_message();
    spinner.show();
    var request = $.ajax({
        url: EP_data,
        cache: false,
        data: formData,
        async: false,
        dataType: 'json',
        //   contentType:  'application/json; charset=utf-8',
        type: 'post'
    });
    request.done(function(output) {
        spinner.hide();
        if (output.response != 'success') {
            show_message(output.response, output.message);
            response_data = false;
        } else {
            response_data = output.message;
            localStorage.setItem('formData', response_data);
        }
    });
    request.fail(function(jqXHR, textStatus, errorThrown) {
        spinner.hide();
        if (textStatus.toLowerCase() == 'timeout') {
            show_message('error', ajax_msg_timeout);
        } else {
            show_message('error', ajax_msg_error);
        }
        response_data = false;
    });

    return response_data;
}

function isnull(val) {
    if (val == null || val === null || val == 'null' || val == undefined || val === undefined || val == 'undefined') {
        return '';
    } else {
        return val;
    }
}

$(document).ready(function() {
    var jsonDataurl = 'json/loanapplication_with_all_details.json';
    var xmlhttp = new XMLHttpRequest();


    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            createForm(myArr);
        }
    };

    xmlhttp.open("GET", jsonDataurl, true);
    xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xmlhttp.send();

});

function createForm(a) {
    console.log(a);
    var tabs, icon = '';
    $('form').html('<h4>' + a.label + '</h4><p>Fill all form field to go next step</p><div class="form-wizard-steps form-wizard-tolal-steps-4"></div><div class="fields_set"></div>');
    $('form').attr('id', a.formId);
    tabs = a.tabs;
    $('.form-wizard-steps').removeClass('form-wizard-tolal-steps-4').addClass('form-wizard-tolal-steps-' + tabs.length);
    $.each(tabs, function(b, c) {
        var tablabel = c.label;
        var tabname = c.name;
        var tab_id = c.id;
        icon = c.icon || '';
        $('.form-wizard-steps').append('<div class="form-wizard-step"><div class="form-wizard-step-icon"><i class="fa fa-' + icon + '" aria-hidden="true"></i></div><p>' + tablabel + '</p></div>');
        $('.fields_set').append('<div id="' + tab_id + '" name="' + tabname + '"></div>')

        $('#' + tab_id).append('<h3>' + tablabel + '</h3>');
        var fields = c.fields;
        $.each(fields, function(d, e) {
            var field_id = e.id;
            var field_name = e.name;
            var field_label = e.label;
            var defaultValue = isnull(e.defaultValue);
            var field_type = e.type;
            var field_placeholder = isnull(e.placeholder);
            var pattern = isnull(e.pattern);
            var readOnly = (e.readOnly === true) ? true : 'false';
            var visible = (e.visible === false) ? 'hidden' : '';
            $('#' + tab_id).append('<div class="form-group ' + visible + ' " id="' + field_id + '"></div>');
            switch (field_type) {
                case 'text':
                    $('#' + field_id).append('<label>' + field_label + ' </label><input type="text" name="' + field_name + '" placeholder="' + field_placeholder + '" class="form-control" value="' + defaultValue + '" pattern="' + pattern + '" readonly="' + readOnly + '">');
                    break;
                case 'radio':
                    $('#' + field_id).append('<label>' + field_label + ' </label>');
                    $.each(e.dataList, function(f, g) {
                        $('#' + field_id).append('<label class="radio-inline " id="' + g.id + '"><input type="radio" name="' + g.name + '" value="' + g.value + '" checked="" readonly="' + readOnly + '"> ' + g.label + '</label>');
                    });
                    $('#' + field_id + ' radio:first').attr("checked", "checked");
                    break;
                case 'dropdown':
                    $('#' + field_id).append('<select name="' + field_name + '" class="form-control" readonly="' + readOnly + '"></select>');
                    $.each(e.dataList, function(f, g) {
                        $('select[name="' + field_name + ']').append(
                            $('<option ></option>').attr('name', g.name).val(g.value).html(g.label)
                        );
                    });
                    $('#' + field_id + ' option:first').attr("selected", "selected");
                    break;
                default:

                    break;
            }

        });
    });


};