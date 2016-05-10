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
        setCoordinates: function (lon, lat, uid) {
            this.lon = lon;
            this.lat = lat;
            this.uid = uid;
        },
        get lonLat() {
            return [this.lon, this.lat];
        },
        get uId() {
            return this.uid;
        }
    };
    var Page = {
        setPage:function(currentPage ){
            this.currentPage = currentPage;
        },
        setInfo:function(ajaxInfo){
            this.ajaxInfo = ajaxInfo;
        },
        get pages(){
            var allPages = Math.floor(this.ajaxInfo.length /10)+1;
            return [this.currentPage,allPages];
        },
        get info(){
            return this.ajaxInfo;
        }
    };
    //查询
    $('#search').click(function () {
        markers = [];//清除点标记
        var data = {
            'province': $('#provice option:selected').html(),
            'city': $('#city option:selected').html(),
            //'district': $('#district option:selected').html();
            'name': '停车场'
        };

        $.ajax({
            //url: 'http://peach-t.uucin.com/apollo/poi/v2/search/',
            url: 'http://192.168.6.95:9001/park_info/get_by_info',
            data: data,
            method: 'GET',
            success: function (msg) {
                var data = JSON.parse(msg)[0];
                var results = data['data'];
                Page.setPage(1);
                Page.setInfo(results);
                console.log(Page.pages);
                if (data['status'] == 'OK') {
                    var showResults = results.slice(0, 10);
                    showData(showResults);
                } else {
                    alert('查询有误！');
                }
            },
            error: function (msg) {
                console.log(msg)
            }
        });
    });

    //var currentPage = 0;
    function showData(result) {
        maps.map.clearMap();
        $('#item-list').html('');
        ajaxUl(result,0);

        //li click
        $('.item').click(function () {
            var lon = $(this).find('.btn-edit').attr('data-lon');
            var lat = $(this).find('.btn-edit').attr('data-lat');
            maps.map.setZoomAndCenter(17, [lon, lat]);
        });
        //点标记

        result.forEach(function (mark, index) {
            _mark = new AMap.Marker({
                map: maps.map,
                icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b' + (index + 1) + '.png',
                position: [mark.lon, mark.lat],
                offset: new AMap.Pixel(-12, -36),
                draggable: false
            });
            _markers.push(_mark);
            maps.map.setFitView();//自适应
            _mark._uu_data = mark;
            //点标记的点击事件
            AMap.event.addListener(_mark, 'click', function () {
                var that = this;
                coordinates.setCoordinates(that._uu_data.lon, that._uu_data.lat, that._uu_data.id);
                showForm(that._uu_data.name, that._uu_data.address);
                modalBtn();
                revise(that);
                commitForm();
            });
        });

        //左侧列表编辑按钮
        $('.btn-edit').click(function () {
            coordinates.setCoordinates($(this).attr('data-lon'), $(this).attr('data-lat'), $(this).attr('data-uid'));
            var id = parseFloat($(this).attr('id')) - 1; //sbsbsbsbsbsbsbsbsb!!!
            var addressName = $(this).siblings('p').find('.address-name').html();
            var addr = $(this).parent('.item-header').siblings('.item-body').find('.addr').html();
            showForm(addressName, addr);
            modalBtn();
            var currentMark = _markers[id];
            currentMark.setClickable(false);
            revise(currentMark);
            commitForm();
        });

    }
    pagination();

    //
    function showForm(addressName, addr) {
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
            var commitData = {
                'uid': coordinates.uId,
                'lon': coordinates.lonLat[0],
                'lat': coordinates.lonLat[1]
            };
            $.ajax({
                url: 'http://192.168.6.95:9001/park_info/update_by_id',
                method: 'put',
                data: commitData,
                success: function (msg) {
                    console.log(msg);
                }
            });
            $('#myModal').modal('hide');
            maps.map.setZoomAndCenter(17, coordinates.lonLat);
            _markers.forEach(function (m) {
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
            maps.map.setZoomAndCenter(17, coordinates.lonLat);
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
            coordinates.setCoordinates(lnglatX, lnglatY, coordinates.uId);
            confirm(lnglatX, lnglatY);
        });
    }

    //分页
    function pagination() {
        $('#previous').click(function () {
            if(Page.pages[0] > 1){
                Page.setPage(Page.pages[0]-1);
                result = Page.info.slice((Page.pages[0]-1)*10-1, Page.pages[0]*10-1);
                $('#item-list').html('');
                ajaxUl(result,(Page.pages[0]-1)*10);
            }else{
                alert('当前是第一页！');
            }

        });
        $('#next').click(function () {
            console.log(Page.pages)
            if(Page.pages[0]<Page.pages[1]){
                Page.setPage(Page.pages[0]+1);
                result = Page.info.slice((Page.pages[0]-1)*10-1, Page.pages[0]*10-1);
                $('#item-list').html('');
                ajaxUl(result,(Page.pages[0]-1)*10);
            }else{
                alert('当前是最后一页！');
            }
        });
    }

    function ajaxUl(result,firstPage){
        var i = firstPage;
        result.forEach(function (data) {
            i++;
            var li = $('<li class=\"item\">' +
                '<div class=\"clearfix item-header\">' +
                '<p class="item-title">' + i + '、' + '<span class="address-name">' + data['name'] + '</span></p>' +
                '<button class=\'btn btn1 btn-default btn-edit\' id=' + i + ' data-uid=' + data['id'] + ' data-lon=' + data['lon'] + ' data-lat=' + data['lat'] + '>编辑</button>' +
                '</div>' +
                '<div class=\"item-body\">' +
                '<p class="addr">' + data['address'] + '</p>' +
                '<div class=\"img-wrap\">' +
                '<img src=\"\" alt="">' +
                '</div>' +
                '<p>更新时间：' + data['updated_time'] + '</p>' +
                '<p>数据来源：</p>' +
                '</div>' +
                '</li>');

            $('#item-list').append(li);
        });
    }

});
























