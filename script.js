let usEducationDataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
let usCountyDataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

let countyDataBase;
let educationDataBase;

// SVG

const w = 950;
const h = 620;
const pad = 50;

// colors

const color1 = '#dff9fb';
const color2 = '#48dbfb';
const color3 = '#0097e6';
const color4 = '#0652DD';
const color5 = '#1B1464';

const findEducData = (n) => {
    let id = n;
        let dataEducation = educationDataBase.find((n) => {
            return n['fips'] == id
        })
        return dataEducation['bachelorsOrHigher']
};

const findCounty = (n) => {
    let id = n;
    let dataEducation = educationDataBase.find((n) => {
        return n['fips'] == id
    })
    return dataEducation['area_name']
}

const svg = d3.select('#main')
    .append('svg')
    .attr('width', w+pad)
    .attr('height', h)
    .attr('class', 'svg_map')

    

const tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .attr('class', 'tooltip')
    .attr('visibility', 'hidden')

const w_legend = 500;
const h_legend = 100;

const legend = d3.select('#legend')
    .append('svg')
    .attr('width', w/2)
    .attr('height', h/5)

const legendScale = d3.scaleBand()
    .domain([0, 15, 25, 30, 45, 60])
    .range([0, w_legend*0.75])

const legendAxis = d3.axisBottom(legendScale)
    .tickSize(10)
    .tickValues(legendScale.domain())

    legend.append('g')
        .attr('transform', `translate(${60}, ${h_legend/2 + 10})`)
        .call(legendAxis)
        .style('font-size', '15px')

const legendRectangles = [0, 1, 2, 3, 4];

    legend.selectAll('rect')
        .data(legendRectangles)
        .enter()
        .append('rect')
        .attr('x', (d, i) => i = i*(w_legend*0.65)/(legendRectangles.length) +85)
        .attr('y', (h_legend/2 + 10) - h_legend/4)
        .attr('width', (w_legend*0.65)/(legendRectangles.length))
        .attr('height', h_legend/4)
        .attr('stroke', 'black')
        .attr('fill', (d, i) => {
            return d == 0 ? color1
            : d == 1 ? color2
            : d == 2 ? color3
            : d == 3 ? color4
            : color5
        })

const createMap = () => {

    svg.selectAll('path')
    .data(countyDataBase)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .style('stroke', 'black')
    .attr('fill', (d) => {
        let id = d['id']
        let dataElement = educationDataBase.find((n) => {
           return n['fips'] == id
        })
        let percentage = dataElement['bachelorsOrHigher'];
        
        return percentage <= 15 ? color1
            :  percentage <= 25 ? color2
            :  percentage <= 30 ? color3
            :  percentage <= 45 ? color4
            :  color5
    })
    .attr('data-fips', (d) => d.id)
    .attr('data-education', (d) => {
        let id = d.id;
        let dataEducation = educationDataBase.find((n) => {
            return n['fips'] == id
        })
        return dataEducation['bachelorsOrHigher']
    })
    .on('mouseover', (e, d) => {
        tooltip.transition()
        .duration(500)
        .style('opacity', 0.8)
        .style('visibility', 'visible')
        .attr('data-education', findEducData(d.id))
        tooltip.html(` <strong>County:</strong> ${findCounty(d.id)} <br> <strong>Percentage of bachelor:</strong> ${findEducData(d.id)}`)
    })
    .on('mousemove', (e, d) => {
        tooltip.style('top', (event.pageY-80)+'px')
        .style('left', (event.pageX-60)+'px')
        .attr('data-education', findEducData(d.id))

    })
    .on('mouseout', (e,d) => {
        tooltip.transition()
        .duration(500)
        .style('visibility', 'hidden')
        .style('opacity', 0.8)
    })
}

// D3 Json

d3.json(usCountyDataUrl).then(
    (data, error) => {
        if(error) {
            console.log(error)
        }else {
            countyDataBase = topojson.feature(data, data.objects.counties).features
            console.log(countyDataBase)
            
            d3.json(usEducationDataUrl).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }else{
                        educationDataBase = data;
                        console.log(educationDataBase);
                        createMap(educationDataBase);
                    }
                }
            )
        }
    }
)

