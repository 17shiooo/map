/**
 * Created by sunjiaqi on 16-5-7.
 */
define(function (require) {
    require('jquery');
    require('../bootstrap-3.3.5-dist/js/bootstrap.min.js');
    var maps = require('map');


    var markers = [];
    var _markers = [];
    var coordinates = {//经纬度
        setCoordinates: function (lon, lat) {
            this.lon = lon;
            this.lat = lat;
        },
        get lonLat() {
            return [this.lon, this.lat];
        }
    };
    //查询
    $('#search').click(function () {
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
    });

    function showData(result) {
        maps.map.clearMap();
        $('#item-list').html('');
        var i = 1;
        result.forEach(function (data, i) {
            i++;
            var li = $('<li class=\"item\">' +
                '<div class=\"clearfix item-header\">' +
                '<p class="item-title">' + i + '、' + '<span class="address-name">' + data['name'] + '</span></p>' +
                '<button class=\'btn btn1 btn-default btn-edit\' id=' + i + ' data-lon=' + data['location']['lon'] + ' data-lat=' + data['location']['lat'] + '>编辑</button>' +
                '</div>' +
                '<div class=\"item-body\">' +
                '<p class="addr">' + data['address'] + '</p>' +
                '<div class=\"img-wrap\">' +
                '<img src=\"\" alt="">' +
                '</div>' +
                '<p>坐标:' + data['location']['lon'] + ' , ' + data['location']['lat'] + '</p>' +
                '<p>数据来源：</p>' +
                '</div>' +
                '</li>');
            $('#item-list').append(li);
        });
        //li click
        $('.item').click(function () {
            var lon = $(this).find('.btn-edit').attr('data-lon');
            var lat = $(this).find('.btn-edit').attr('data-lat');
            maps.map.setZoomAndCenter(15, [lon, lat]);
        });
        //点标记

        result.forEach(function (mark, index) {
            _mark = new AMap.Marker({
                map: maps.map,
                icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b' + (index + 1) + '.png',
                position: [mark.location['lon'], mark.location['lat']],
                offset: new AMap.Pixel(-12, -36),
                draggable: false
            });
            _markers.push(_mark);
            maps.map.setFitView();//自适应
            _mark._uu_data = mark;
            //点标记的点击事件
            AMap.event.addListener(_mark, 'click', function () {
                var that = this;
                coordinates.setCoordinates(that._uu_data.location.lon, that._uu_data.location.lat);
                showForm(that._uu_data.name,that._uu_data.address);
                modalBtn();
                revise(that);
                commitForm();
            });
        });

        //左侧列表编辑按钮
        $('.btn-edit').click(function () {
            coordinates.setCoordinates($(this).attr('data-lon'), $(this).attr('data-lat'));
            var id = parseFloat($(this).attr('id')) - 1; //sbsbsbsbsbsbsbsbsb!!!
            var addressName = $(this).siblings('p').find('.address-name').html();
            var addr = $(this).parent('.item-header').siblings('.item-body').find('.addr').html();
            showForm(addressName,addr);
            modalBtn();
            var currentMark = _markers[id];
            currentMark.setClickable(false);
            revise(currentMark);
            commitForm();
        });

    }

    //
    function showForm(addressName,addr){
        $('#myModal').modal();
        $('#addressName').val(addressName);
        $('#address').val(addr);
        $('#addressLon').html(coordinates.lonLat[0]);
        $('#addressLat').html(coordinates.lonLat[1]);
    }

    //弹出层按钮行为
    function modalBtn() {
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
    }

    //保存定位
    function confirm(X, Y) {
        $('#confirm').click(function () {
            $('#myConfirm').modal('hide');
            $('#myModal').modal();
            $('#addressLon').html(X);
            $('#addressLat').html(Y);
        });
    }

    //提交
    function commitForm() {
        $('#commit').click(function () {
            //此处提交ajax
            $('#myModal').modal('hide');
            maps.map.setZoomAndCenter(15, coordinates.lonLat);
            _markers.forEach(function(m){
                m.setClickable(true);
                m.setDraggable(false);
            })
        });
    }

    //新增停车场
    $('#btn-added').click(function () {
        $('#myModal').modal();

    });

    //修改
    function revise(mark) {
        $('.pos-btn').click(function () {
            mark.setDraggable(true);
            mark.setClickable(false);
            $('#myModal').modal('hide');
            maps.map.setZoomAndCenter(15, coordinates.lonLat);
            draged(mark);
        });
    }

    //拖拽
    function draged(mark) {
        AMap.event.addListener(mark, 'dragend', function (e) {
            $('#myConfirm').modal();
            var lnglatX = e.lnglat.getLng();
            var lnglatY = e.lnglat.getLat();
            $('#currentLon').html(lnglatX);
            $('#currentLat').html(lnglatY);
            coordinates.setCoordinates(lnglatX, lnglatY);
            confirm(lnglatX, lnglatY);
        });
    }
});
























