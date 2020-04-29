
 function createMetadata(sampleid){
  d3.json("samples.json").then(function(data) {
   
    var metadata = data.metadata;
     console.log(metadata);
    
     
    result = metadata.filter(x => x.id == sampleid );
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
