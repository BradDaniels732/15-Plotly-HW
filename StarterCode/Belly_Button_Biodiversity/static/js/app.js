function buildMetadata(sample) { 

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(sample){

    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function ([key, value]) {
      var row = sample_metadata.append("p");
      row.text(`${key}: ${value}`);
    });

    // BONUS: Build the Gauge Chart
    buildGauge(sample.WFREQ);
  });
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  url = `/samples/${sample}`;
  d3.json(url).then(function(sample) {

    // @TODO: Build a Bubble Chart using the sample data
    var xvalues = sample.otu_ids;
    var yvalues = sample.sample_values;
    var bsize = sample.sample_values;
    var bvalues = sample.otu_labels;

    // Make the colors of the largest 10 items to be the same as in the pie chart above
    // Other items will be black
    // I could have done "var bcolors = sample.otu_ids". but this is more interesting!!!
    // The following is from https://community.plot.ly/t/plotly-colours-list/11730/3
    var bcolors = [
      '#1f77b4',  // muted blue
      '#ff7f0e',  // safety orange
      '#2ca02c',  // cooked asparagus green
      '#d62728',  // brick red
      '#9467bd',  // muted purple
      '#8c564b',  // chestnut brown
      '#e377c2',  // raspberry yogurt pink
      '#7f7f7f',  // middle gray
      '#bcbd22',  // curry yellow-green
      '#17becf'   // blue-teal
  ]

    var trace1 = {
      x: xvalues,
      y: yvalues,
      text: bvalues,
      mode: 'markers',
      marker: {
        color: bcolors,
        size: bsize
      } 
    };
  
    var data = [trace1];

    var layout = {
      xaxis: { title: "OTU ID"},
    };

    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    d3.json(url).then(function(sample) {  
      var pvalues = sample.sample_values.slice(0,10);
        var plabels = sample.otu_ids.slice(0,10);
        var phovertext = sample.otu_labels.slice(0,10);
  
        var data = [{
          values: pvalues,
          labels: plabels,
          hovertext: phovertext,
          type: 'pie'
        }];
  
        Plotly.newPlot('pie', data);
  
      });
    });   
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();
