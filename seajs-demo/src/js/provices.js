/**
 * Created by sunjiaqi on 16-5-7.
 */
//省市三级联动
define(function (require) {
    require('jquery');
    var data = require('admin_code');
    var provices, cities, distincts;
    var provice, city, distinct, default_provice = '北京市';
    provices = data;
    //加载省份的options
    //触发省份change事件
    var proviceOptions = '', cityOptions = '', distinctOptions = '';
    for (var i = 0; i < provices.length; i++) {
        proviceOptions += '<option value=' + i + '>' + provices[i]['name'] + '</option>';
    }
    for (var m = 0; m < provices[0]['cities'].length; m++) {
        cityOptions += '<option value=' + i + '>' + provices[0]['cities'][m]['name'] + '</option>';
    }
    distinctOptions = '<option value=\'\'>-无-</option>';
    $('#provice').html(proviceOptions);
    $('#city').html(cityOptions);
    $('#distinct').html(distinctOptions);

    $('#provice').change(function () {
        cityOptions = '';
        var distinctStatus = $('#distinct').html();
        provice = $('#provice option:selected').val();
        cities = provices[provice].cities;
        for (var j = 0; j < cities.length; j++) {
            cityOptions += '<option value=' + j + '>' + cities[j]['name'] + '</option>';
        }
        $('#city').html(cityOptions);
        distinctOptions = '';
        distinct = $('#city option:selected').val();
        distincts = cities[distinct].dists;
        if (distincts) {
            for (var n = 0; n < distincts.length; n++) {
                distinctOptions += '<option value=' + n + '>' + distincts[n]['name'] + '</option>';
            }
        } else {
            distinctOptions = '<option value=\'\'>-无-</option>';
        }

        $('#distinct').html(distinctOptions);

        $('#city').change(function () {
            distinctOptions = '';
            distinct = $('#city option:selected').val();
            distincts = cities[distinct].dists;
            if (distincts) {
                for (var n = 0; n < distincts.length; n++) {
                    distinctOptions += '<option value=' + n + '>' + distincts[n]['name'] + '</option>';
                }
            } else {
                distinctOptions = '<option value=\'\'>-无-</option>';
            }
            $('#distinct').html(distinctOptions);
        });
    });


});