import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import { select, csv, scaleLinear, extent, axisLeft, axisBottom, format } from 'd3'
// import { data } from './data';


function App() {

  const [data, setData] = useState([]);

  const svgRef = useRef();

  const title = 'Cars information'
  const margin = { top: 40, right: 40, bottom: 70, left: 130}
  const circleRadius = 10;
  const xAxisLabel = 'mgg'
  const xValue =  d => d.mpg;

  const yAxisLabel = 'weight';
  const yValue = d => d.horsepower;


  useEffect(() => {

    const svg = select(svgRef.current);

    csv('https://vizhub.com/curran/datasets/auto-mpg.csv')
    .then(data => {
      data.forEach(d => {
        d.mpg = +d.mpg;
        d.cylinders = +d.cylinders;
        d.displacement = +d.displacement;
        d.horsepower = +d.horsepower;
        d.weight = +d.weight;
        d.acceleration = +d.acceleration;
        d.year = +d.year;
      })
      console.log(data)
      setData(data)
    })

    const width = +(svg.attr('width'));
    const height = +(svg.attr('height'));
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;



    const xScale = scaleLinear()
      .domain(extent(data, xValue))
      .range([0, innerWidth])
      .nice();

    const yScale = scaleLinear()
      .domain(extent(data, yValue))
      .range([0, innerHeight]);


    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

      const xAxisTickFormat = number => 
      format('.3s')(number)
      .replace('G', 'B')


      const xAxis = axisBottom(xScale)
      .tickFormat(xAxisTickFormat)
      .tickSize( - innerHeight)

      const yAxis = axisLeft(yScale)
      .tickSize(- innerWidth)

    const yAxisG = g.append('g')
      .call(yAxis);
    yAxisG
       .selectAll('.domain')
         .remove();

      yAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('y', + 80)
      .attr('x', + 220)
      .attr('fill', 'black')
      .attr('transform', `rotate(90)`)
      .attr('text-anchor', 'middle')
      .text(yAxisLabel)

    const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);

    xAxisG.select('.domain').remove();

    xAxisG.append('text')
        .attr('y', 50)
        .attr('class', 'axis-label')
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text(xAxisLabel)

    
      g.selectAll('circle')
      .data(data)
      .enter().append('circle')
      .attr('cy', d => yScale(yValue(d)))
      .attr('cx', d => xScale(xValue(d)))
      .attr('r', circleRadius)
      .attr('fill', 'steelblue')
    
    g.append('text')
      .attr('class', 'title')
      .attr('y', -10)
      .attr('x', 150)
      .text(title)
      
   }, [data])

  return (
    <div className="App">
      <h2>Making a Bar Chart in D3</h2>
       <svg ref={svgRef} width="960" height="500">
      </svg>
    </div>
  );
}

export default App;