/* d3.json("samples.json").then(function(data) {
    console.log(data[0]);
    console.log(data);
  }); ?
*/
  
 
function createMetadata(sampleid){
  d3.json("samples.json").then(function(data) {
   
    var metadata = data.metadata;
     console.log(metadata);
    
     
    result = metadata.filter(x => x.id == sampleid );
    wfreq = result[0].wfreq;

    wfreq = + wfreq ;
    console.log (result)
    var sample_metadata = d3.select("#sample-metadata")
    // Used `.html("") to clear any existing metadata
    .html('')
    Object.entries(result[0]).forEach(function([key, value]) {
      console.log(key,value);
      var row = sample_metadata.append("tr");
      row.append("td").html(`<strong><font size = '1'>${key}</font></strong>:`);
      row.append('td').html(`<font size ='1'>${value}</font>`);  
   
    });

    //--Guage chart

   
    var data = [
      {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: "Washing Frequency Scrubs per Week" },
          type: "indicator",
          mode: "gauge+number",
          labels: parseFloat(wfreq),
          gauge: { axis: { range: [null, 9] },
              steps :[
                {range: [0,1], color: "#f8f3ec"},
                {range: [1,2], color: "#f4f1e4"},
                {range: [2,3], color: "#e9e6c9"},
                {range: [3,4], color: "#e5e8b0"},
                {range: [4,5], color: "#d5e599"},
                {range: [5,6], color: "#b7cd8f"},
                {range: [6,7], color: "#8ac086"},
                {range: [7,8], color: "#88bc8d"},
                {range: [8,9], color: "#84b588"},
              ],
              axis: {range: [0, 9], 
                 tickvals: [0,1,2,3,4,5,6,7,8,9]},
              bar: {color: "#840000"}
          }
      }
  ];

  var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } }; 


 
  
  Plotly.newPlot('gauge', data, layout);
    

    
    //
  });
};

function createchart(sampleid){
  d3.json("samples.json").then(function(data) {
   
    var samples = data.samples;
    console.log(samples);
    var result = samples.filter(x => x.id == sampleid );
    console.log (result);

    otu_ids = result[0].otu_ids;
    otu_labels = result[0].otu_labels;
    sample_values = result[0].sample_values;
    // console.log(otu_ids,otu_labels,sample_values);

    //  bubble chart

    var trace1 = {
      x:otu_ids,
      y:sample_values,
      text:otu_labels,
      mode:"markers",
      marker:{
        size: sample_values,
        color:otu_ids,
        labels: otu_labels,
        type:"scatter"
         }
    };

    var layout = {
      xaxis: { title: "OTU ID"},
    };

    var bubble_data = [trace1];
    
    Plotly.newPlot("bubble", bubble_data,layout);

    // bar chart
    
     // Slice the data 

   var samplevalueSort = sample_values.slice(0,10).reverse();
   var idSort = otu_ids.slice(0,10).reverse();
   var labelsSort = otu_labels.slice(0,10).reverse();
   var chartLabels = idSort.map(l => "OTU " + l);
    console.log (samplevalueSort)
    console.log (idSort)
    console.log (labelsSort)
   
     var trace1 = {
      x : samplevalueSort,
      y : chartLabels,
      text : labelsSort,
      type: "bar"
      ,orientation: "h"
    }; 
    
    // data
    var bar_data = [trace1];

    Plotly.newPlot("bar", bar_data);

  });
};

// on Page load

  function init() {

    d3.json("samples.json").then(function(data) {
     
    var samples =data.samples ;
    console.log(samples);
    var sampleDropdown = d3.select("#selDataset");
    sampleDropdown.selectAll("option")
    //collect only unique values
    .data(d3.map( samples,d => d.id).keys())
    .enter().append("option").attr("value", d => d)
    .text(d => d).sort(d3.descending); 

    
    id = samples[0].id;
    createMetadata(id);

    createchart(id);

   
  })
};

  // Call updatePlotly() when a change takes place to the DOM

d3.selectAll("#selDataset").on("change", updatePlotly);

// This function is called when a dropdown menu item is selected
function updatePlotly() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  var SelctedId = dropdownMenu.property("value");

  createMetadata(SelctedId);

  createchart(SelctedId);


  console.log (SelctedId)
  
};

init();
