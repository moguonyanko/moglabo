/**
 * @fileoverview 都市と都市を結ぶ線のサンプル
 * 参考:
 * https://gunmagisgeek.com/blog/d3-js/2913
 * 備考:
 * D3.jsのv3でないとd3.jsonによるJSON読み込みが成功しない。
 */

const d3 = window.d3;
const topojson = window.topojson;

d3.json("./geodata/conuntries.topojson", function (json) {
  d3main(json);
});

function d3main(json) {
  var width = 960;
  var height = 480;

  var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

  //投影法設定
  var projection = d3.geo.equirectangular()
    .scale(153)
    .translate([width / 2, height / 2])
    .rotate([-180, 0, 0])
    .precision(.1);

  //パスジェネレーター
  var path = d3.geo.path().projection(projection);

  //グリッド情報ジェネレーター
  var graticule = d3.geo.graticule();

  //グリッド線追加    
  var grid = svg.append("path")
    .datum(graticule)
    .attr({
      "class": "graticule",
      "d": path,
      "fill": "none",
      "stroke": "#777",
      "stroke-width": ".5px",
      "stroke-opacity": .5
    });

  //国土追加  
  var land = svg.insert("path", ".graticule")
    .datum(topojson.object(json, json.objects.conuntries))
    .attr({
      "class": "land",
      "d": path,
      "fill": "green"
    });

  //国境線追加
  var boundary = svg.insert("path", ".graticule")
    .datum(topojson.object(json, json.objects.conuntries,
      function (a, b) { return a !== b; }))
    .attr({
      "class": "boundary",
      "d": path,
      "fill": "none",
      "stroke": "white",
      "stroke-width": .5
    });

  //都市・位置情報
  var pointdata = {
    "type": "LineString",
    "coordinates": [
      [139.69170639999993, 35.6894875], //東京
      [-122.41941550000001, 37.7749295], //サンフランシスコ
      [149.1242241, -35.30823549999999], //キャンベラ
      [77.22496000000001, 28.635308], //ニューデリー
      [-47.92916980000001, -15.7801482], //ブラジリア
      [116.40752599999996, 39.90403], //北京
    ]
  };

  const segments = [
    {
      "type": pointdata.type,
      "coordinates": [
        pointdata.coordinates[0], //東京
        pointdata.coordinates[1] //サンフランシスコ
      ]
    },
    {
      "type": pointdata.type,
      "coordinates": [
        pointdata.coordinates[1], //サンフランシスコ
        pointdata.coordinates[2] //キャンベラ
      ]
    },
    {
      "type": pointdata.type,
      "coordinates": [
        pointdata.coordinates[2], //キャンベラ
        pointdata.coordinates[3] //ニューデリー
      ]
    },
    {
      "type": pointdata.type,
      "coordinates": [
        pointdata.coordinates[3], //ニューデリー
        pointdata.coordinates[4] //ブラジリア
      ]
    },
    {
      "type": pointdata.type,
      "coordinates": [
        pointdata.coordinates[4], //ブラジリア
        pointdata.coordinates[5] //北京
      ]
    },
  ];

  //都市間ライン追加
  for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex++) {
    const selector = `line segment${segmentIndex}`;
    svg.selectAll(`.${selector}`).data([segments[segmentIndex]])
      .enter()
      .append("path")
      .attr({
        "class": selector,
        "d": path,
        "fill": "none",
        "stroke": "red",
        "stroke-width": 1.5
      });
  }

  // var line = svg.selectAll(".line")
  //   .data([pointdata])
  //   .enter()
  //   .append("path")
  //   .attr({
  //     "class": "line",
  //     "d": path,
  //     "fill": "none",
  //     "stroke": "red",
  //     "stroke-width": 1.5
  //   });

  //都市ポイント追加      
  var point = svg.selectAll(".point")
    .data(pointdata.coordinates)
    .enter()
    .append("circle")
    .attr({
      "cx": function (d) { return projection(d)[0]; },
      "cy": function (d) { return projection(d)[1]; },
      "r": 6,
      "fill": "red",
      "fill-opacity": 1
    });

  /***Y軸回転させる***************************************/

  let rotateY = 0;

  d3.select('body').on('click', function () {
    rotateY = 0;
    setInterval(mapRotate, 100);
  });

  function mapRotate() {
    //projection 更新
    rotateY++;
    if (rotateY >= 360) rotateY = 0
    projection.rotate([-180, rotateY, 0]);

    //各要素を更新
    grid.attr("d", path);
    land.attr("d", path);
    boundary.attr("d", path);
    let line = svg.selectAll(".line");
    line.attr("d", path);
    point.attr({
      "cx": function (d) { return projection(d)[0]; },
      "cy": function (d) { return projection(d)[1]; },
    })
  }

}  
