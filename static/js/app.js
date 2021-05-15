// App

// Run this function on the Dropdown update
function optionChanged(id) {
    updatePlot(id);
}

// Update the Bar Chart Plot
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
                b: 30
            }
        };

        // create the bar plot
        Plotly.newPlot("bar", data, layout);

    });
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
        
        updatePlot(data.names[0]);
    });
}

init();