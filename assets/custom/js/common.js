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

/*
$(document).on('keyup', ':input', function(e) {
    e.preventDefault();
    var validation = $(this).attr('validation');
    if (validation.length) {
        $.each(e.validators, function(k, v) {
         var   pattern = `${v.name}= "${v.value}"`;
          var   helptext = v.mesage || '';
        });

    }
});
*/
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
    if ($(this).hasClass('required')) {
        if ($(this).val() == "") {
            $(this).addClass('input-error');
            $(this).closest('.form-group').addClass('has-error');
        } else {
            $(this).removeClass('input-error');
            $(this).closest('.form-group').removeClass('has-error');
        }
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

function checkNull(val) {
    var ret_value = "";
    if (val === null || val === 'null' || val === undefined || val == 'undefined') {
        ret_value = true;
    } else {
        ret_value = false;
    }
    return ret_value;
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
    var tabs, formButtons, icon = '';
    $('form').html('<h4>' + a.label + '</h4><p>Fill all form field to go next step</p><div class="form-wizard-steps form-wizard-tolal-steps-4"></div>');
    $('form').attr('id', a.formId);
    tabs = a.tabs;
    var totaltabs = tabs.length;
    var first_tab = Math.round(100 / totaltabs);
    var tabwidth = Math.round(100 / totaltabs);
    $('.form-wizard-steps').removeClass('form-wizard-tolal-steps-4').addClass('form-wizard-tolal-steps-' + totaltabs);
    $.each(tabs, function(b, c) {
        icon = c.icon || '';

        if (first_tab == tabwidth) {
            formButtons = '<div class="form-wizard-buttons"><button type="button" class="btn btn-next">Next</button></div>';
        } else if (tabwidth != first_tab && tabwidth < 95) {
            formButtons = `<div class="form-wizard-buttons"><button type="button" class="btn btn-previous">Previous</button>
            <button type="button" class="btn btn-next">Next</button></div>`;
        } else {
            formButtons = `<div class="form-wizard-buttons"><button type="button" class="btn btn-previous">Previous</button>
            <button type="submit" class="btn btn-submit">Submit</button></div>`;
        }

        //active
        $('.form-wizard-steps').append('<div class="form-wizard-step"><div class="form-wizard-step-icon"><i class="fa fa-' + icon + '" aria-hidden="true"></i></div><p>' + c.label + '</p></div>');
        $('form').append('<fieldset id="fields_' + c.id + '"></fieldset>');
        var $original_tab_id = $('#fields_' + c.id);
        var visible = (c.visible === false) ? 'hidden' : '';
        $original_tab_id.append('<div id="' + c.id + '" name="' + c.name + '" class="' + visible + '"></div>');
        if (c.fields !== null) {
            var tab_label = c.label;
            var fields = c.fields;
            var $tab = $('#' + c.id);
            $tab.append('<h5 class="text-center">' + tab_label + '</h5>');
            makeinputFields($original_tab_id, $tab, c.id, tab_label, fields, c);
        }
        tabwidth += tabwidth;
        $('#fields_' + c.id).append(formButtons);

    });
    $('.form-wizard-step:first').addClass('active');
    $('.progress-bar:first').addClass('active');
    $('fieldset:first').fadeIn('slow');
};


function makeinputFields($original_tab_id, $tab, tab_id, tab_label, fields, a) {


    var pattern, help_block;
    if (fields !== null) {
        $.each(fields, function(d, e) {
            var field_id = e.id;
            var field_name = e.name;
            var field_label = e.label;
            var defaultValue = checkNull(e.defaultValue) ? '' : 'value="' + e.defaultValue + '" ';
            var field_type = e.type;
            var placeholder = checkNull(e.placeholder) ? '' : 'placeholder="' + e.placeholder + '" ';
            var required = e.required ? 'required' : '';

            if (e.validators !== null) {
                pattern = checkNull(e.validators.pattern) ? '' : 'pattern ="' + e.validators.pattern + '" ';
                help_block = '<span class="help-block hidden">' + e.validators.error_message + '</span>';
            } else {
                pattern = '';
                help_block = '';
            }


            var readOnly = (e.readOnly === true) ? 'readonly="' + e.readOnly + '"' : '';
            var visible = (e.visible === false) ? 'hidden' : '';
            $tab.append('<div class="form-group ' + visible + ' " id="' + field_id + '"></div>');
            $('#' + field_id).append('<label>' + field_label + ' </label>');
            switch (field_type) {
                case 'text':
                case 'email':
                case 'date':
                case 'number':
                    $('#' + field_id).append('<input type="' + field_type + '" name="' + field_name + '"  ' + placeholder + ' class="form-control ' + required + '" ' + defaultValue + readOnly + ' ' + pattern + ' >' + help_block);
                    break;
                case 'radio':
                case 'checkbox':
                    $.each(e.dataList, function(f, g) {
                        $('#' + field_id).append('<label class="' + field_type + '-inline " id="' + g.id + '"><input type="' + field_type + '" name="' + g.name + '" value="' + g.value + '" checked="" ' + readOnly + '> ' + g.label + '</label>' + help_block);
                    });
                    $('#' + field_id + ' ' + field_type + ':first').attr("checked", "checked");
                    break;
                case 'dropdown':
                case 'select':
                    if (e.placeholder) {
                        placeholder = '<option value="" disabled selected>' + e.placeholder + '</option>';
                    }
                    $('#' + field_id).append('<select name="' + field_name + '" class="form-control ' + required + '" ' + readOnly + '>' + placeholder + '</select>' + help_block);
                    $.each(e.dataList, function(f, g) {
                        $('#' + field_id + ' select[name=' + field_name + ']').append(
                            '<option id="' + g.id + '" name="' + g.name + '" value="' + g.value + '" >' + g.label + '</option>');
                    });
                    $('#' + field_id + ' select option:first').attr("selected", "selected");
                    break;
                default:

                    break;
            }
            $('#' + field_id).append('');

        });
    }
    var addon_section1 = '',
        addon_section2 = '';
    /*
     var ttype = jQuery.type(a.sections);
            console.log(ttype + ' found under ' + a);
            */


    if (a.sections !== null) {
        $.each(a.sections, function(x, y1) {
            var visible = (y1.visible === false) ? 'hidden' : '';
            if (y1.fields) {
                $original_tab_id.append('<a href="#" class="load_extras" data-id="' + y1.id + '" data-visible="no">' + y1.label + '</a> <div id="' + y1.id + '" name="' + y1.name + '"  style="display:none;" class="' + visible + '" ></div>');
                var tab_label1 = y1.label;
                var fields1 = y1.fields;
                var $newtab = $('#' + y1.id);
                $newtab.append('<h5 class="text-center hide_extras" data-id="' + y1.id + '">' + tab_label1 + '</h5>');
                makeinputFields($original_tab_id, $newtab, y1.id, tab_label1, fields1, y1);
            }
            if (y1.groups !== null) {
                $.each(y1.groups, function(x2, y2) {

                    var visible = (y2.visible === false) ? 'hidden' : '';
                    if (y2.fields) {
                        $original_tab_id.append('<a href="#" class="load_extras" data-id="' + y2.id + '" data-visible="no">' + y2.label + '</a> <div id="' + y2.id + '" name="' + y2.name + '"  style="display:none;" class="' + visible + '" ></div>');
                        var tab_label2 = y2.label;
                        var fields2 = y2.fields;
                        var $newtab = $('#' + y2.id);
                        $newtab.append('<h5 class="text-center hide_extras" data-id="' + y2.id + '">' + tab_label2 + '</h5>');
                        makeinputFields($original_tab_id, $newtab, y2.id, tab_label2, fields2, y2);
                    }
                });
            }
        });

    }

    if (a.groups !== null) {
        $.each(a.groups, function(x3, y3) {
            var visible = (y3.visible === false) ? 'hidden' : '';
            if (y3.fields) {
                $original_tab_id.append('<a href="#" class="load_extras" data-id="' + y3.id + '" data-visible="no">' + y3.label + '</a> <div id="' + y3.id + '" name="' + y3.name + '" style="display:none;" class="' + visible + '"></div>');
                var tab_label3 = y3.label;
                var fields3 = y3.fields;
                var $newtab = $('#' + y3.id);
                $newtab.append('<h5 class="text-center hide_extras" data-id="' + y3.id + '">' + tab_label3 + '</h5>');
                makeinputFields($original_tab_id, $newtab, y3.id, tab_label3, fields3, y3);
            }
        });
    }
    //  $tab.append('');

    $original_tab_id.append('<div class="more_data" >' + addon_section1 + '</div>' + addon_section2);
}

$(document).on('click', '.load_extras', function(e) {

    e.preventDefault();
    var $this = $(this);
    var id = $this.data('id');
    $('#' + id).fadeIn('slow');

    $('html, body').animate({
        scrollTop: $('#' + id).offset().top
    }, 1000);
    $this.fadeOut('slow');


});
$(document).on('click', '.hide_extras', function(e) {

    e.preventDefault();
    var $this = $(this);
    var id = $this.data('id');
    $(".more_data .load_extras[data-id='" + id + "']").fadeIn('slow');
    $('html, body').animate({
        scrollTop: $("form").offset().top
    }, 200);
    $('#' + id).fadeOut('slow');


});