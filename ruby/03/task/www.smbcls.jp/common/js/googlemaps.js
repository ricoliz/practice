(function (){

  if(smbc.ua.lteIE6) return;

  $(window).load(function() {

      var latlng = new google.maps.LatLng(35.71704, 139.735535);
      
      var myOptions = {
        zoom: 18,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      // マップ生成
      var map = new google.maps.Map(document.getElementById('map'), myOptions);

      // マーカー追加 // animation: google.maps.Animation.DROP,
      var marker = new google.maps.Marker({
        position: latlng,
        draggable: true,
        map: map, 
        title: 'SMBCラーニングサポート株式会社'
      });

  });

}());