const url ="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
fetch(url).then(res=>res.json()).then(dataset=>{
  const h = 630;
  const w = 920;
  const padding = 40;
  var div = d3.select("body").append("div").
attr("class", "tooltip").
attr("id", "tooltip").
style("opacity", 0);
  dataset.map((value,index,arr)=>{
    if(value.Doping!=""){
      return value.Doping = true;
    }
    else{
      return value.Doping = false;
    }
  })
  let minTime = d3.min(dataset,(d,i)=> d.Seconds);
  let maxTime = d3.max(dataset,(d,i)=> d.Seconds);
  let minYear = d3.min(dataset,(d,i)=> d.Year);
  let maxYear = d3.max(dataset,(d,i)=> d.Year);
  let xScale = d3.scaleLinear().domain([minYear-1,maxYear+1.5]).range([padding,w]);
  let yScale = d3.scaleLinear().domain([maxTime,minTime]).range([h-padding,padding]);
  let xAxis = d3.axisBottom(xScale).tickFormat((d)=>Number(d));
  let yAxis = d3.axisLeft(yScale).tickFormat((d)=>Math.floor(d/60)+":"+(d%60||"00"));
  
  const svg = d3.select("#content").append("svg").attr("width",w).attr("height",h);
  svg.selectAll("circle").data(dataset).enter().append("circle").attr("class","dot")
  .attr("cx",(d,i)=>xScale(d.Year)).attr("cy",(d,i)=>yScale(d.Seconds))
  .attr("r",(d)=>5)
   .attr("data-xvalue",d=>Number(d.Year))
    .attr("data-yvalue",d=>{
    return d.Seconds;
  })
   .attr("fill",(d,i)=>{
    if(d.Doping){
      return "rgb(31, 119, 180)";
    }
    else{
      return "rgb(255, 127, 14)";
    }
  }).attr("fill-opacity",0.6).attr("stroke","black")
   .on("mouseover", function (d) {
    div.style("opacity", .9);
    div.attr("data-year", d.Year);
    div.html(d.Name + ": " + d.Nationality + "<br/>" +
    "Year: " + d.Year + ", Time: " + d.Time).
    style("left", d3.event.pageX + "px").
    style("top", d3.event.pageY + "px");
  }).
  on("mouseout", function (d) {
    div.style("opacity", 0);
  });
  
  
  svg.append("g").attr("id","x-axis")
   .attr("transform", "translate(0, " + (h - padding) + ")")
   .call(xAxis);
  svg.append("g").attr("id","y-axis")
   .attr("transform", `translate(${padding},0)` )
   .call(yAxis);
 
  
  //Making legend
  let legendContainer = svg.append("g").attr("id","legend");
  let legend = legendContainer.selectAll("#legend")
  .data(["rgb(31, 119, 180)","rgb(255, 127, 14)"])
  .enter()
  .append("g")
  .attr("transform", function (d, i) {
    return "translate(0," + (h / 3 - i * 40) + ")";
  })
  
  legend.append("rect")
  .attr("x", w-padding)
  .attr("width", 30)
  .attr("height", 30)
  .style("fill",(d,i)=>d)
  
  legend.append("text")
  .attr("x", w-padding*6)
  .attr("dy", "1em")
  .text(function (d,i) {
    if (i==0) return "Riders with doping allegations";
    else
    {
      return "No doping allegations";
    };
  });
  
  
})
