        // set the dimensions and margins of the graph
        var margin3 = {
                top: 10,
                right: 30,
                bottom: 30,
                left: 60
            },
            width3 = 460 - margin3.left - margin3.right,
            height3 = 400 - margin3.top - margin3.bottom;


        // append the svg object to the body of the page
        var svg3 = d3.select("#yvonne")
            .append("svg")
            .attr("width", width3 + margin3.left + margin3.right)
            .attr("height", height3 + margin3.top + margin3.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin3.left + "," + margin3.top + ")");

        // parse the date / time
        var parseTime = d3.timeParse("%Y");

        // set the ranges
        var x = d3.scaleTime().range([0, width3]);
        var y = d3.scaleLinear().range([height3, 0]);

        // define the 1st line
        var valueline = d3.line()
            .x(function(d) {
                return x(d.date);
            })
            .y(function(d) {
                return y(d.close);
            });

        // define the 2nd line
        var valueline2 = d3.line()
            .x(function(d) {
                return x(d.date);
            })
            .y(function(d) {
                return y(d.open);
            });

        // Get the data
        d3.csv("https://raw.githubusercontent.com/boredkyara/karen/master/yvonne.csv", function(error, data) {
            if (error) throw error;

            // format the data
            data.forEach(function(d) {
                d.date = parseTime(d.year);
                d.close = +d.yvonne;
                d.open = +d.karen;
            });

            // Max value observed:
            const max = d3.max(data, function(d) {
                return +d.open;
            })

            // Scale the range of the data
            x.domain(d3.extent(data, function(d) {
                return d.date;
            }));
            y.domain([0, d3.max(data, function(d) {
                return Math.max(d.close, d.open);
            })]);

            // Set the gradient
            svg3.append("linearGradient")
                .attr("id", "line-gradient")
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("x1", 0)
                .attr("y1", y(0))
                .attr("x2", 0)
                .attr("y2", y(max))
                .selectAll("stop")
                .data([{
                    offset: "0%",
                    color: "blue"
                }, {
                    offset: "100%",
                    color: "red"
                }])
                .enter().append("stop")
                .attr("offset", function(d) {
                    return d.offset;
                })
                .attr("stop-color", function(d) {
                    return d.color;
                });

            // Add the valueline path.
            svg3.append("path")
                .data([data])
                .attr("class", "line")
                .attr("stroke", "#282828")
                .attr("d", valueline);

            // Add the valueline2 path.
            svg3.append("path")
                .data([data])
                // .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "rgba(163, 51, 39, 0.8)")
                .attr("stroke-width", 2)
                .attr("d", valueline2);

            // Add the X Axis
            svg3.append("g")
                .attr("transform", "translate(0," + height3 + ")")
                .call(d3.axisBottom(x));

            // Add the Y Axis
            svg3.append("g")
                .call(d3.axisLeft(y));


            // Handmade legend
            svg3.append("circle").attr("cx", 240).attr("cy", 130).attr("r", 6).style("fill", "rgba(163, 51, 39, 0.8)")
            svg3.append("circle").attr("cx", 240).attr("cy", 160).attr("r", 6).style("fill", "#282828")
            svg3.append("text").attr("x", 260).attr("y", 130).text("Karen").style("font-size", "15px").attr("alignment-baseline", "middle")
            svg3.append("text").attr("x", 260).attr("y", 160).text("Yvonne").style("font-size", "15px").attr("alignment-baseline", "middle")


        });