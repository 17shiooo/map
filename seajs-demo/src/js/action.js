/**
 * Created by sunjiaqi on 16-5-7.
 */
define(function (require) {
    require('jquery');
    require('../bootstrap-3.3.5-dist/js/bootstrap.min.js');
    var maps = require('map');


    var markers = [];
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
        //模拟数据
        var msg = {
            "total": 18888,
            "results": [{
                "uid": 18651938,
                "name": "怀柔区",
                "location": {"lat": "40.316304", "lon": "116.631979"},
                "category": 49030,
                "province": "北京市",
                "city": "",
                "district": "怀柔区",
                "address": "",
                "telephone": [],
                "park_info": {},
                "shop_info": {},
                "hotel_info": {},
                "movie_info": {},
                "scenic_info": {},
                "child_count": 0,
                "park_flag": 0
            }, {
                "uid": 18560702,
                "name": "碾子乡",
                "location": {"lat": "40.80644", "lon": "116.49796"},
                "category": 49031,
                "province": "北京市",
                "city": "",
                "district": "怀柔区",
                "address": "",
                "telephone": [],
                "park_info": {},
                "shop_info": {},
                "hotel_info": {},
                "movie_info": {},
                "scenic_info": {},
                "child_count": 0,
                "park_flag": 0
            }, {
                "uid": 18648596,
                "name": "庙城镇",
                "location": {"lat": "40.292615", "lon": "116.635051"},
                "category": 49031,
                "province": "北京市",
                "city": "",
                "district": "怀柔区",
                "address": "",
                "telephone": [],
                "park_info": {},
                "shop_info": {},
                "hotel_info": {},
                "movie_info": {},
                "scenic_info": {},
                "child_count": 0,
                "park_flag": 0
            }, {
                "uid": 18619826,
                "name": "九渡河镇",
                "location": {"lat": "40.361797", "lon": "116.46985"},
                "category": 49031,
                "province": "北京市",
                "city": "",
                "district": "怀柔区",
                "address": "",
                "telephone": [],
                "park_info": {},
                "shop_info": {},
                "hotel_info": {},
                "movie_info": {},
                "scenic_info": {},
                "child_count": 0,
                "park_flag": 0
            }, {
                "uid": 18648597,
                "name": "杨宋镇",
                "location": {"lat": "40.295659", "lon": "116.685195"},
                "category": 49031,
                "province": "北京市",
                "city": "",
                "district": "怀柔区",
                "address": "",
                "telephone": [],
                "park_info": {},
                "shop_info": {},
                "hotel_info": {},
                "movie_info": {},
                "scenic_info": {},
                "child_count": 0,
                "park_flag": 0
            }, {
                "uid": 18644951,
                "name": "桥梓镇",
                "location": {"lat": "40.290497", "lon": "116.574067"},
                "category": 49031,
                "province": "北京市",
                "city": "",
                "district": "怀柔区",
                "address": "",
                "telephone": [],
                "park_info": {},
                "shop_info": {},
                "hotel_info": {},
                "movie_info": {},
                "scenic_info": {},
                "child_count": 0,
                "park_flag": 0
            }, {
                "uid": 18571967,
                "name": "宝山寺乡",
                "location": {"lat": "40.697442", "lon": "116.573768"},
                "category": 49031,
                "province": "北京市",
                "city": "",
                "district": "怀柔区",
                "address": "",
                "telephone": [],
                "park_info": {},
                "shop_info": {},
                "hotel_info": {},
                "movie_info": {},
                "scenic_info": {},
                "child_count": 0,
                "park_flag": 0
            }, {
                "uid": 18648595,
                "name": "怀柔镇",
                "location": {"lat": "40.302199", "lon": "116.640608"},
                "category": 49031,
                "province": "北京市",
                "city": "",
                "district": "怀柔区",
                "address": "",
                "telephone": [],
                "park_info": {},
                "shop_info": {},
                "hotel_info": {},
                "movie_info": {},
                "scenic_info": {},
                "child_count": 0,
                "park_flag": 0
            }, {
                "uid": 18619825,
                "name": "渤海镇",
                "location": {"lat": "40.41531", "lon": "116.467207"},
                "category": 49031,
                "province": "北京市",
                "city": "",
                "district": "怀柔区",
                "address": "",
                "telephone": [],
                "park_info": {},
                "shop_info": {},
                "hotel_info": {},
                "movie_info": {},
                "scenic_info": {},
                "child_count": 0,
                "park_flag": 0
            }, {
                "uid": 18621626,
                "name": "怀北镇",
                "location": {"lat": "40.388951", "lon": "116.68931"},
                "category": 49031,
                "province": "北京市",
                "city": "",
                "district": "怀柔区",
                "address": "",
                "telephone": [],
                "park_info": {},
                "shop_info": {},
                "hotel_info": {},
                "movie_info": {},
                "scenic_info": {},
                "child_count": 0,
                "park_flag": 0
            }]
        }
        var results = msg.results;
        showData(results);
        //$.ajax({
        //    url: 'http://peach.uucin.com/apollo/poi/v2/search/',
        //    data: data,
        //    method: 'GET',
        //    success: function (msg) {
        //        var results = msg.results;
        //        showData(results);
        //    },
        //    error: function (msg) {
        //        console.log(msg)
        //    }
        //});
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
            //markers.push(data);
        });
        //点标记
        var _markers = [];
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
                $('#myModal').modal();
                $('#addressName').val(that._uu_data.name);
                $('#address').val(that._uu_data.address);
                $('#addressLon').html(that._uu_data.location.lon);
                $('#addressLat').html(that._uu_data.location.lat);
                modalBtn();
                //修改经纬度
                $('.pos-btn').click(function () {
                    $('#myModal').modal('hide');
                    maps.map.setZoomAndCenter(14, [that._uu_data.location.lon, that._uu_data.location.lat]);
                    that.setDraggable(true);
                    //AMap.event.removeListener(_m);记得删除点击事件
                    //点标记拖拽
                    AMap.event.addListener(that, 'dragend', function (e) {
                        console.log(that)
                        $('#myConfirm').modal();
                        var lnglatX = e.lnglat.getLng();
                        var lnglatY = e.lnglat.getLat();
                        $('#currentLon').html(lnglatX);
                        $('#currentLat').html(lnglatY);
                        confirm(lnglatX, lnglatY);
                    });
                });
            });
        });

        //左侧列表编辑按钮
        $('.btn-edit').click(function () {
            $('#myModal').modal({
                backdrop: true,
                keyboard: true
            });
            var id = parseFloat($(this).attr('id')) -1; //sbsbsbsbsbsbsbsbsb!!!
            var addressName = $(this).siblings('p').find('.address-name').html();
            var addr = $(this).parent('.item-header').siblings('.item-body').find('.addr').html();
            $('#addressName').val(addressName);
            $('#address').val(addr);
            $('#addressLon').html($(this).attr('data-lon'));
            $('#addressLat').html($(this).attr('data-lat'));
            $('.cancel').addClass('hidden').siblings('.preservation').addClass('hidden').siblings('.modify').removeClass('hidden');
            modalBtn();
            var currentMark = _markers[id];
            $('.pos-btn').click(function(){
                $('#myModal').modal('hide');
                maps.map.setZoomAndCenter(14, [$('#addressLon').html(), $('#addressLat').html()]);
                currentMark.setDraggable(true);
                //点标记拖拽
                AMap.event.addListener(currentMark, 'dragend', function (e) {

                    $('#myConfirm').modal();
                    var lnglatX = e.lnglat.getLng();
                    var lnglatY = e.lnglat.getLat();
                    $('#currentLon').html(lnglatX);
                    $('#currentLat').html(lnglatY);
                    confirm(lnglatX, lnglatY);
                });
            });
        });
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

});
























