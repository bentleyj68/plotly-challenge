// App - javascript to update the "Belly Button" information on the web page

// Run this function on the Dropdown update
function optionChanged(id) {
    updatePlot(id);
}

// Update all the Plots and Demographic on the web page
function updatePlot(id){

    console.log(`The value selected is ${id}`);

    const datafile = "data/samples.json";

    d3.json(datafile).then(function(data) {

        // filter sample values by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        // console.log(samples);
        
        // Return top 10 Samples and labels
        var samples_top_ten = samples.sample_values.slice(0, 10).reverse();
        var otu_top_ten = samples.otu_ids.slice(0, 10).reverse();
        var otu_hover = samples.otu_labels.slice(0, 10).reverse();
        
        // Add OTU to labels
        var otu_labels = otu_top_ten.map(d => "OTU " + d)

        // Update all the charts
        updateBarPlot(samples_top_ten, otu_labels, otu_hover);
        updateBubbleChart(samples);
        meta = data.metadata.filter(meta => meta.id.toString() === id)[0];
        // console.log(meta.wfreq);
        updateGauge(meta.wfreq);

        // Update the demographic
        updateDemographic(meta);

    });
}

// Update the Bar Plot - Graph 1
function updateBarPlot(samples_top_ten, otu_labels, otu_hover){

    // create trace variable for the plot
    var trace1 = {
        x: samples_top_ten,
        y: otu_labels,
        text: otu_hover,
        orientation: "h",
        marker: {
            color: 'rgb(72, 120, 170)',
            width: 1
        },
        type:"bar"
    };

    // create data variable
    var data = [trace1];

    // create layout variable to set plots layout
    var layout = {
        yaxis:{
            tickmode:"linear",
        },
        margin: {
            l: 100,
            r: 100,
            t: 0,
            b: 20
        }
    };

    // create the bar plot
    Plotly.newPlot("bar", data, layout);
}


// Update the Bubble Chart - Graph 2
function updateBubbleChart(samples){

    var trace2 = {
        x: samples.otu_ids,
        y: samples.sample_values,
        mode: "markers",
        marker: {
            size: samples.sample_values,
            color: samples.otu_ids
        },
        text: samples.otu_labels
    };

    // set the layout for the bubble plot
    var layout = {
        xaxis:{title: "OTU ID"},
        height: 600,
        width: 1200
    };

    var data = [trace2];

    // update the bubble chart
    Plotly.newPlot("bubble", data, layout); 
}

// Update the Demographic
function updateDemographic(metadata){
    console.log(metadata);
    // set the demographic div id 
    var demographic_div = d3.select("#sample-metadata");
        
    // clear the demographic div
    demographic_div.html("");

    // Update the panel
    Object.entries(metadata).forEach((key) => {   
            demographic_div.append("p").text(key[0] + ": " + key[1]);    
    });
}

// Bonus - Update the Gauge - Graph 3
function updateGauge(wfreq){
    console.log(wfreq);
    data = [
        {
            type: "indicator",
            mode: "gauge+number",
            value: parseFloat(wfreq), 
            title: { text: "Belly Button Washing Frequency \n Scrubs per Week", font: { size: 16 } },
            gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
                bar: { color: "#696969" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "#696969",
                steps: [
                { range: [0, 1], color: 'rgb(8, 29, 88)' },
                { range: [1, 2], color: 'rgb(37, 52, 148)' },
                { range: [2, 3], color: 'rgb(34, 94, 168)' },
                { range: [3, 4], color: 'rgb(29, 145, 192)' },
                { range: [4, 5], color: 'rgb(65, 182, 196)' },
                { range: [5, 6], color: 'rgb(127, 205, 187)' },
                { range: [6, 7], color: 'rgb(99, 233, 180)' },
                { range: [7, 8], color: 'rgb(237, 248, 217)' },
                { range: [8, 9], color: 'rgb(255, 225, 217)' },
                ],
            }
        }
    ];
    
    layout = {
        width: 500,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "white",
        font: { color: "#696969", family: "Arial" }
    };
    
    Plotly.newPlot('gauge', data, layout);
}

// Initial function to read in data and update the dropdown
function init() {

    const datafile = "data/samples.json";

    d3.json(datafile).then(function(data) {

        // select dropdown menu 
        var dropdown = d3.select("#selDataset");

        // add the names to the dropdown
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });     
        
        // Display the Plots for the first entry in the dataset
        updatePlot(data.names[0]);

    });
}

init();