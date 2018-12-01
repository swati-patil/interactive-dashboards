function buildMetadata(sample) {
    
  // @TODO: Complete the following function that builds the metadata panel
  var url = '/metadata/' + sample;
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(data) {
    console.log("URL  " , url);
        console.log("newdata", data);
        var sample_container = d3.select("#sample-metadata");
        sample_container.html("");
        var values = [];
        for (let [k,v] of Object.entries(data)) {
            //console.log("key " , k);
            var pair = {};
            pair["key"] = k; pair["value"] = v;
            values.push(pair);
        }
        console.log(values);
        sample_container.selectAll("div").data(values)
          .enter() // creates placeholder for new data
          .append("div") // appends a div to placeholder
          .html(function(d) {
            return d.key + ":" + d.value;
          });
      });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = '/samples/' + sample;
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(sampleData) {
    console.log("URL  " , url);
        console.log("newdata", sampleData);
        //var values = [];
        //var labels = [];
        var hover_text = [];

        var values = sampleData.sample_values.slice(0,10);
        var labels = sampleData.otu_ids.slice(0,10);
        var texts = sampleData.otu_labels.slice(0,10);

        console.log(values);
        console.log(labels);
        var data = [{
          values: values,
          labels: labels,
          text: texts,
          type: "pie"
        }];

        var layout = {
          height: 600,
          width: 800
        };

        Plotly.newPlot("pie", data, layout);
        //Plotly.restyle("pie", data);

        var trace1 = {
          x: sampleData.otu_ids,
          y: sampleData.sample_values,
          text: sampleData.otu_labels,
          mode: 'markers',
          marker: {
            color: sampleData.otu_ids,
            size: sampleData.sample_values
          }
        };

        var data = [trace1];

        var layout = {
          title: '',
          showlegend: false,
          height: 600,
          width: 1200
        };

        Plotly.newPlot('bubble', data, layout);
      });

    // @TODO: Build a Bubble Chart using the sample data
    

    // @TODO: Build a Pie Chart
    

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

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
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
