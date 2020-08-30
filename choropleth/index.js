/*
//topojson
//https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json

let svg = d3.select('svg');
const width = +svg.attr('width');
const height= +svg.attr('height');
let url="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
let info ="https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv"
// We need topojson feature
const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);
const g= svg.append('g');
svg.call(d3.zoom().on('zoom',()=>{
    g.attr('transform',d3.event.transform)
}))

fetch(url).then(res=>res.json()).then(data=>{
    let countries = topojson.feature(data, data.objects.countries) 
    console.log(data);   
    const paths = g.selectAll('path')
    .data(countries.features);
    paths.enter().append('path')
    .attr('d',d=>pathGenerator(d))
    .append('title').text(d=>d.properties.name);
     
})
*/
let searchState;
document.getElementById("search").addEventListener('click',()=>{
  let input = document.getElementById("state").value;
  document.getElementById("state").value=null;
  if(input==""){
    searchState=undefined;
  }
  else{
    searchState=input;
  }
  render(searchState);
})
var body = d3.select("body");

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var tooltip = body.append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

//map and projection


var x = d3.scaleLinear()
    .domain([2.6, 75.1])
    .rangeRound([600, 860]);

//data
var unemployment = d3.map();
var color = d3.scaleThreshold()
    .domain(d3.range(2.6, 75.1, (75.1-2.6)/8))
    .range(d3.schemeGreens[9]);

var g = svg.append("g")
    .attr("class", "key")
    .attr("id", "legend")
    .attr("transform", "translate(0,40)");

//Legend
let selectedInterval;
let oldSelectedInterval;
g.selectAll("rect")
  .data(color.range().map(function(d) {
      d = color.invertExtent(d);
      if (d[0] == undefined) d[0] = x.domain()[0];
      if (d[1] == undefined) d[1] = x.domain()[1];
      return d;
    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .attr("fill", function(d) { return color(d[0]); })
    .style('cursor','pointer')
    .on('click',(d,i,arr)=>{
        selectedInterval = d;
        if(selectedInterval==oldSelectedInterval){
          d3.selectAll('rect').style('opacity',1);
        }
        else{
          arr.forEach((value,index,ar)=>{
            if(index!=i){
              d3.select(arr[index]).style('opacity',0.2);
            }
            else{
              d3.select(arr[index]).style('opacity',1);
            }
          })
        }
        render(selectedInterval);
    });

g.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")

g.call(d3.axisBottom(x)
    .tickSize(13)
    .tickFormat(function(x) { return Math.round(x) + '%' })
    .tickValues(color.domain()))
    .select(".domain")
    .remove();
const COUNTY ="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const EDU ="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const pathGenerator = d3.geoPath()

let render =(param)=>{
    Promise.all([fetch(COUNTY),fetch(EDU)])
    .then(result => Promise.all(result.map(v => v.json())))
      .then(([data,edu])=>{
        let map = new Map();
      edu.forEach((value,index,arr)=>{
        map.set(value.fips,[value.area_name,value.state,value.bachelorsOrHigher])
      })
      let county = topojson.feature(data,data.objects.counties)
      let threshold = d3.scaleThreshold().domain([3,12,21,30,39,48,57,66])
      .range(d3.schemeGreens[9]);
      let paths = svg.selectAll('path') .remove()
      .exit().data(county.features).enter().append('path')
      .attr('class','county')
      .attr('d',d=>pathGenerator(d))
      .style('fill',d=>threshold(map.get(d.id)[2]))
      .style('opacity',d=>{
          if(searchState!=undefined){
            if(map.get(d.id)[1]==searchState){
              return 1;
            }
            else{
              return 0.1;
            }
          }
          
          if(selectedInterval==undefined||(oldSelectedInterval===selectedInterval)){
            oldSelectedInterval=selectedInterval=undefined;
            return 1;
          }
          else {
            if(param[0]<=map.get(d.id)[2]&&map.get(d.id)[2]<=param[1]){
              return 1;
            }
            else{
              return 0.1;
            }
          }
    })
     .on('mouseover',(d,i)=>{
       tooltip.style('opacity',0.9);
       tooltip.html(()=>{
         let arr = map.get(d.id)
         return arr[0]+","+arr[1] +" "+arr[2]+" %";
       })
        .style("left", (d3.event.pageX + 10) + "px") 
         .style("top", (d3.event.pageY - 28) + "px");
     })
      .on("mouseout", function(d) { 
                tooltip.style("opacity", 0); 
        
       });
      ;
      
      oldSelectedInterval=selectedInterval;
  
    })
  }

render(undefined);
