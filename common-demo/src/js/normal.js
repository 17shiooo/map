/**
 * Created by sunjiaqi on 16-5-5.
 */
//弹出层
function showDiv(a) {
    var id = $(a).attr('id');
    document.getElementById("bg").style.display = "block";
    document.getElementById("show").style.display = "block";
    var addressName = $(a).siblings('p').find('.address-name').html();
    var addr = $(a).parent('.item-header').siblings('.item-body').find('.addr').html();
    $('#addressName').val(addressName);
    $('#address').val(addr);
    $('#addressLon').val($(a).attr('data-lon'));
    $('#addressLat').val($(a).attr('data-lat'));
    $('.cancel').addClass('hidden').siblings('.preservation').addClass('hidden').siblings('.modify').removeClass('hidden');
    $('.show-body').find('input').attr('disabled', true);

}

function hideDiv() {
    document.getElementById("bg").style.display = 'none';
    document.getElementById("show").style.display = 'none';
}


$(function () {
//初始化地图对象，加载地图
    ////初始化加载地图时，若center及level属性缺省，地图默认显示用户当前城市范围
    var map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 10
    });
    //点标记
    var markers = [];
    var marker = new AMap.Marker();
    marker.setMap(map);

    // 逆向地理编码
    AMap.service('AMap.Geocoder', function () {
        geocoder = new AMap.Geocoder({
            city: $('#city').val()
        });

    });
    //地图点击事件
    AMap.event.addListener(map,'click',function (e) {
        $('#location').html(e.lnglat.getLng() + ' , ' + e.lnglat.getLat());
    });
    map.setFitView();//自适应

// provices cities 联动

    var provices, cities, distincts;
    var provice, city, distinct, default_provice = '北京市';
    $.getJSON('./src/js/admin_code.json', function (data) {
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


    var search = document.getElementById('search');
    search.onclick = function () {
        markers = [];//清除点标记

        var data = {};
        var region = $('#provice option:selected').html() + $('#city option:selected').html();
        if ($('#keyword').val() == '') {
            data = {
                'region': region,
                'uu_id': '13256464sdf465465sd'
            }
        } else {
            data = {
                'region': region,
                'keyword': $('#keyword').val(),
                'uu_id': '13256464sdf465465sd'
            }
        }
        $.ajax({
            url: 'http://peach-t.uucin.com/apollo/poi/v2/search/',
            data: data,
            method: 'GET',
            success: function (msg) {
                var results = msg.results;
                showData(results);
            },
            error: function (msg) {
                console.log(msg)
            }
        });
    }

//平铺数据
    function showData(result) {

        $('#item-list').html('');
        for (var i = 0; i < result.length; i++) {
            var li = $('<li class=\"item\">' +
                '<div class=\"clearfix item-header\">' +
                '<p class="item-title">' + (i + 1) + '、' + '<span class="address-name">' + result[i]['name'] + '</span></p>' +
                '<button class=\'btn btn1\' id=' + i + ' data-lon=' + result[i]['location']['lon'] + ' data-lat=' + result[i]['location']['lat'] + ' onclick=\'showDiv(this)\'>编辑</button>' +
                '</div>' +
                '<div class=\"item-body\">' +
                '<p class="addr">' + result[i]['address'] + '</p>' +
                '<div class=\"img-wrap\">' +
                '<img src=\"\" alt="">' +
                '</div>' +
                '<p>坐标:' + result[i]['location']['lon'] + ' , ' + result[i]['location']['lat'] + '</p>' +
                '<p>数据来源：</p>' +
                '</div>' +
                '</li>');
            $('#item-list').append(li);
            //
            lnglatXY = [result[i]['location']['lon'], result[i]['location']['lat']];
            var location = {
                icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b' + (i + 1) + '.png',
                position: lnglatXY
            }
            markers.push(location);
            //根据坐标获取信息
            geocoder.getAddress(lnglatXY, function (status, results) {
                if (status === 'complete' && results.info === 'OK') {
                    //alert(result);
                    //console.log(results)
                } else {
                    console.log('获取地址失败！');
                }
            });



            //var _mark = new AMap.Marker({
            //    map: map,
            //    icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b' + (i + 1) + '.png',
            //    position: [result[i]['location']['lon'], result[i]['location']['lat']],
            //    offset: new AMap.Pixel(-12, -36),
            //    draggable: false
            //});
            //_mark.uu_data = result[i];
            //AMap.event.addListener(_mark, 'dragend',function(){
            //    confirm('你确定定位到此处？');
            //    showDiv();//获取数据的办法想下
            //    console.log(this.uu_data);
            //});
            //加地图上
        }
        //拖拽
        //$('.pos-btn').click(function(){
        //    hideDiv();
        //    $('#dragger-btn').removeClass('hidden');
        //    _mark.setDraggable(true);
        //});
        //点标记
        map.clearMap();
        //markers.forEach(function (mark) {
        //    var _mark = new AMap.Marker({
        //        map: map,
        //        icon: mark.icon,
        //        position: [mark.position[0], mark.position[1]],
        //        offset: new AMap.Pixel(-12, -36),
        //        draggable: false
        //    });
        //    _mark.uu_data = mark;
        //    AMap.event.addListener(_mark, 'click',  showDiv);
        //    var position = _mark.getPosition();
        //    $('.pos-btn').click(function(){
        //        hideDiv();
        //        $('#dragger-btn').removeClass('hidden');
        //
        //        _mark.setDraggable(true);
        //        AMap.event.addListener(_mark, 'dragend',function(){
        //            confirm('你确定定位到此处？');
        //            showDiv();//获取数据的办法想下
        //        });
        //
        //    });
        //});
        //自适应
    }


//弹出层
//modify
    $('.modify').click(function () {
        $(this).siblings('input').removeAttr('disabled');
        $(this).addClass('hidden').siblings('button').removeClass('hidden');
    });
    $('.cancel').click(function () {
        $(this).siblings('input').attr('disabled', 'disabled');
        $(this).addClass('hidden').siblings('.preservation').addClass('hidden').siblings('.modify').removeClass('hidden');
    });
    $('.preservation').click(function () {
        $(this).siblings('input').attr('disabled', 'disabled');
        $(this).addClass('hidden').siblings('.cancel').addClass('hidden').siblings('.modify').removeClass('hidden');
    });

});








