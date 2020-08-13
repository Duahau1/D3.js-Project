const url ="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
fetch(url).then(res=>res.json())
  .then(data=>{
       let dataset = data.data;
       const w =900;
       const h = 460;
       const padding=50;
  let point= [];
  dataset.forEach((value,index,arr)=>{
    point.push([new Date(value[0]),Number(value[1]),value[0]]);
  })
  	var maxValue = Math.round(d3.max(point, (d) => d[1]));

  const xScale = d3.scaleTime()
     .domain([d3.min(point,d=>d[0]), d3.max(point,d=>d[0])])
                     .range([padding, w-3 ]);
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(point,d=>d[1])])
                     .range([h-padding , 0]);
 
      
  
  const svg = d3.select("#content").append("svg")
.attr("width",w).attr("height",h).attr("class","canvas");
   
  let tooltip = svg.append("text")
  .attr("id","tooltip").attr("x",0.5* w-200 )
  .attr("y",0.5*h)
  .attr("opacity", 0.9)
	.attr("z-index", 3)
  .style("border","5px solid black")
 
  
svg.selectAll("rect").data(point).enter().append("rect")
  .attr("class","bar")
  .attr("x", (d) => xScale(d[0]))
  .attr("y",(d,i) => yScale(d[1]))
   .style("width",d=>w/(point.length+30))
  .style("height",d=>yScale(maxValue-d[1]))
  .attr('data-date', (d,i) => (d[2]))
	.attr('data-gdp', (d,i) => (d[1]))
  .on("mouseover",(d,i)=>{
  tooltip.text(d[2] + ": $" + d[1] + " Billions of Dollars")
			.attr('data-date', d[2])
			.attr('opacity', 0.9);
})
 .on('mouseout', function(d) {
			tooltip.attr('opacity', 0);
		})
  .append("title")
		.text ((d,i) => d[2] + ": $" + d[1] + " Billions of Dollars")
		.attr("data-date",(d,i) => (d[2]));
     const xAxis = d3.axisBottom(xScale);
    svg.append("g")
    .attr("id","x-axis")
       .attr("transform", "translate(0," + (h-padding) + ")")
       .call(xAxis);
     const yAxis = d3.axisLeft(yScale);
  svg.append("g")
  .attr("id","y-axis")
   .attr("transform",`translate(50,0)`)
   .call(yAxis);
svg.append("text")
  .text("Gross Domestic Product")
  .attr("transform", `translate(${padding+20},170) rotate(-90)`)
 /*
<text transform="rotate(-90)" x="-200" y="80">Gross Domestic Product</text>
*/
})
