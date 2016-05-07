/**
 * Created by sunjiaqi on 16-5-7.
 */
define(function(require,exports){
    require('jquery');
    require('http://webapi.amap.com/maps?v=1.3&key=ebe8e4078d079ff51cd3a89a1884e245');
    ////初始化加载地图时，若center及level属性缺省，地图默认显示用户当前城市范围
    var map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 10
    });
    //点标记
    var marker = new AMap.Marker();
    marker.setMap(map);
    //地图点击事件
    AMap.event.addListener(map,'click',function (e) {
        $('#location').html(e.lnglat.getLng() + ' , ' + e.lnglat.getLat());
    });
    map.setFitView();//自适应

    exports.map = map;

});