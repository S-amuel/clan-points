function _height(){return(
1000
)}

function _2(chart,d3,transformToGenericObjectList,data){return(
chart(d3.hierarchy(transformToGenericObjectList(data))
      .sum(function(d) { return d.Points; })
      .sort(function(a, b) { return b.Points - a.Points }))
)}

function _3(d3,transformToGenericObjectList,data){return(
d3.hierarchy(transformToGenericObjectList(data))
      .sum(function(d) { return d.Name; })
)}

function _chart(d3,DOM,width,height){return(
function chart(root) {
  const svg = d3.select(DOM.svg(width, height));
  
  var format = d3.format(",d"),
      color = d3.scaleOrdinal(d3.schemeSet3)

  var tooltip = d3.select("body").append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "rgba(0, 0, 0, 0.75)")
    .style("border-radius", "6px")
    .style("font", "12px sans-serif")
    .text("tooltip");
  
  var bubble = d3.pack()
    .size([width, height])
    .padding(1.5);

  bubble(root);
  var node = svg.selectAll(".node")
      .data(root.children)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { 
        console.log(d);
          return color(d.data.Name); 
      })
      .on("mouseover", function(d) {
          tooltip.text(d.data.Name + ": " + format(d.value));
          tooltip.style("visibility", "visible");
          d3.select(this).style("stroke", "black");
      })
      .on("mousemove", function() {
          return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      })
      .on("mouseout", function() {
        d3.select(this).style("stroke", "none");
        return tooltip.style("visibility", "hidden");
      });

  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .style("font", "10px sans-serif")
      .style("pointer-events", "none")
      .text(function(d) { return d.data.Name });

   return svg.node();
}
)}

function _transformToGenericObjectList(){return(
function transformToGenericObjectList(flatData) {
  var container = {};
  container.children = [];
  var regionToCountry = {};
  flatData.forEach(entry => {
      container.children.push({Name: entry["Name"], Points: entry["Points"]});
  });
  return container;
}
)}

function _data(d3){return(
d3.csv("https://gist.githubusercontent.com/S-amuel/4151263ae51fe0852109e67ff917c35b/raw/e44731076a2d27020fe3b28b1a4303f57710cad3/gistfile1.csv")
)}

function _d3(require){return(
require("https://d3js.org/d3.v5.min.js")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer("height")).define("height", _height);
  main.variable(observer()).define(["chart","d3","transformToGenericObjectList","data"], _2);
  main.variable(observer()).define(["d3","transformToGenericObjectList","data"], _3);
  main.variable(observer("chart")).define("chart", ["d3","DOM","width","height"], _chart);
  main.variable(observer("transformToGenericObjectList")).define("transformToGenericObjectList", _transformToGenericObjectList);
  main.variable(observer("data")).define("data", ["d3"], _data);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
