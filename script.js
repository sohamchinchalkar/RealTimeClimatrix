// Set up the dimensions of the SVG container
const width = 1480;
const height = 690;

// Append the SVG element to the body
d3.select("body")
    .style("font-family", "Arial, sans-serif")
    .style("background", "linear-gradient(135deg, #89f7fe, #66a6ff)")
    .append("h1")
    .text("Check Weather!")
    .style("text-align", "center")
    .style("color", "Black")
    .style("margin", "20px 0")
    .style("font-size", "36px")
    .style("text-shadow", "2px 2px 4px rgba(0, 0, 0, 0.5)");

const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("display", "block")
    .style("margin", "0 auto")
    .style("box-shadow", "0px 4px 15px rgba(0, 0, 0, 0.2)")
    .style("border-radius", "10px")
    .style("overflow", "hidden");

const searchContainer = d3.select("body").append("div")
    .style("position", "absolute")
    .style("top", "20px")
    .style("right", "20px")
    .style("background", "rgba(255, 255, 255, 0.7)")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("box-shadow", "0px 4px 10px rgba(0,0,0,0.2)");

searchContainer.append("input")
    .attr("type", "text")
    .attr("placeholder", "Search city...")
    .attr("id", "search-input")
    .style("padding", "5px 10px")
    .style("font-size", "14px")
    .style("border-radius", "5px")
    .style("border", "1px solid #ccc")
    .style("width", "150px");

searchContainer.append("button")
    .text("Search")
    .attr("id", "search-btn")
    .style("padding", "6px 12px")
    .style("font-size", "14px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "5px")
    .style("background", "#66a6ff")
    .style("color", "white")
    .style("cursor", "pointer");

// OpenWeatherMap API URL and your API Key
const apiKey = "cd293e29f0017b1c2bc18bf8a71fe50e"; // Replace with your API key
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

// Add a legend card for temperature indication and filters
const legend = d3.select("body").append("div")
    .attr("class", "legend-card")
    .style("position", "absolute")
    .style("top", "120px")
    .style("right", "30px")
    .style("background", "rgba(255, 255, 255, 0.9)")
    .style("padding", "15px")
    .style("border", "1px solid #cccccc")
    .style("border-radius", "10px")
    .style("box-shadow", "0px 4px 10px rgba(0,0,0,0.3)")
    .html(`
        <strong style="font-size: 18px; color: #333;">Temperature Indication</strong><br>
        <button class="filter" data-range="below-0" style="background: darkblue; color: white; margin: 5px; border: none; border-radius: 5px; padding: 7px; transition: all 0.3s;">Below 0°C</button><br>
        <button class="filter" data-range="0-20" style="background: blue; color: white; margin: 5px; border: none; border-radius: 5px; padding: 7px; transition: all 0.3s;">0-20°C</button><br>
        <button class="filter" data-range="20-40" style="background: lightcoral; color: white; margin: 5px; border: none; border-radius: 5px; padding: 7px; transition: all 0.3s;">20-40°C</button><br>
        <button class="filter" data-range="above-40" style="background: darkred; color: white; margin: 5px; border: none; border-radius: 5px; padding: 7px; transition: all 0.3s;">Above 40°C</button><br>
        <button class="filter" data-range="all" style="background: gray; color: white; margin: 5px; border: none; border-radius: 5px; padding: 7px; transition: all 0.3s;">Show All</button>
    `);


// Additional weather-related and city bubble functionalities as already implemented...


d3.selectAll(".filter").style("cursor", "pointer").on("mouseover", function () {
    d3.select(this).style("transform", "scale(1.1)").style("box-shadow", "0px 3px 10px rgba(0,0,0,0.3)");
}).on("mouseout", function () {
    d3.select(this).style("transform", "scale(1)").style("box-shadow", "none");
});

// Load world map data (GeoJSON)
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(worldData => {

    // Load the city dataset
    d3.csv("cities.csv").then(cityData => {

        console.log("City Data:", cityData);

        // Define a projection to map lat/lon to x/y
        const projection = d3.geoMercator()
            .scale(150) // Adjust the scale for the map size
            .translate([width / 2, height / 1.5]);

        // Define a path generator using the projection
        const path = d3.geoPath().projection(projection);

        // Draw the map
        svg.selectAll(".country")
            .data(worldData.features)
            .enter().append("path")
            .attr("class", "country")
            .attr("d", path)
            .style("fill", "#dfe6e9")
            .style("stroke", "#2d3436")
            .style("stroke-width", "0.5px")
            .on("mouseover", function () {
                d3.select(this).style("fill", "#b2bec3");
            })
            .on("mouseout", function () {
                d3.select(this).style("fill", "#dfe6e9");
            });

        // Define a color scale for temperature
        const colorScale = temperature => {
            if (temperature < 0) return "darkblue"; // Below 0°C
            if (temperature >= 0 && temperature < 20) return "blue"; // 0-20°C
            if (temperature >= 20 && temperature <= 40) return "lightcoral"; // 20-40°C
            if (temperature > 40) return "darkred"; // Above 40°C
        };

        // Add a tooltip card for weather data
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip-card")
            .style("position", "absolute")
            .style("background", "rgba(0,0,0,0.8)")
            .style("color", "#ffffff")
            .style("padding", "10px")
            .style("border-radius", "5px")
            .style("box-shadow", "0px 4px 10px rgba(0,0,0,0.4)")
            .style("display", "none")
            .style("font-size", "14px");

        // Plot cities on the map
        svg.selectAll(".city")
    .data(cityData)
    .enter().append("circle")
    .attr("class", "city")
    .attr("id", d => `city-${d.city}`)
    .attr("cx", d => {
        const projected = projection([+d.lng, +d.lat]);
        return projected ? projected[0] : null;
    })
    .attr("cy", d => {
        const projected = projection([+d.lng, +d.lat]);
        return projected ? projected[1] : null;
    })
    .attr("r", 5)
    .style("fill", "gray")
    .style("opacity", 0.8)
    .style("transition", "all 0.3s")
    .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 8);
        tooltip.html(`
            <strong>${d.city}, ${d.country}</strong><br>
            <em>Loading...</em>
        `)
            .style("display", "block")
            .style("left", `${event.pageX + 15}px`)
            .style("top", `${event.pageY - 30}px`);
    })
    .on("mousemove", (event) => {
        tooltip.style("left", `${event.pageX + 15}px`)
            .style("top", `${event.pageY - 30}px`);
    })
    .on("mouseout", function () {
        d3.select(this).attr("r", 5);
        tooltip.style("display", "none");
    })
    .on("click", async function (event, d) {
        tooltip.style("display", "none"); // Hide tooltip on click

        const historicalData = await fetchHistoricalWeather(d);
        if (historicalData) {
            renderChart(d.city, historicalData);
        }
    });

        // Initialize bubbles with weather data
        async function initializeBubbles() {
            const promises = cityData.map(city => fetchWeather(city));
            const results = await Promise.all(promises);
        
            results.forEach((data, i) => {
                if (data && data.cod === 200) {
                    const temperature = data.main.temp;
                    const city = cityData[i];
                    city.temperature = temperature; // Store temperature for filtering
                    
                    // Define initial position (off-screen left)
                    const initialX = -4000;
        
                    // Get the final x and y positions from the projection
                    const projected = projection([+city.lng, +city.lat]);
                    const finalX = projected ? projected[0] : null;
                    const finalY = projected ? projected[1] : null;
        
                    // Append the city bubble with transition
                    d3.select(`#city-${city.city}`)
                        .attr("cx", initialX) // Start from the left
                        .attr("cy", finalY)
                        .transition()
                        .duration(3000) // Duration of the transition
                        .ease(d3.easeBounce) // Optional: bounce easing
                        .attr("cx", finalX) // Transition to the final x position
                        .style("fill", colorScale(temperature)); // Set the color after the transition
                }
            });
        }
        

        // Filter cities based on temperature range
function filterCities(range) {
    svg.selectAll(".city")
        .style("opacity", d => {
            if (!d.temperature) return 0;
            if (range === "below-0") return d.temperature < 0 ? 1 : 0;
            if (range === "0-20") return d.temperature >= 0 && d.temperature < 20 ? 1 : 0;
            if (range === "20-40") return d.temperature >= 20 && d.temperature <= 40 ? 1 : 0;
            if (range === "above-40") return d.temperature > 40 ? 1 : 0;
            return 1;
        });
}


        d3.selectAll(".filter").on("click", function () {
            const range = d3.select(this).attr("data-range");
            filterCities(range);
        });

        // Fetch weather data for a single city
        async function fetchWeather(city) {
            const cityName = `${city.city},${city.country}`;
            const url = `${apiUrl}${cityName}&appid=${apiKey}&units=metric`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    console.error(`Error ${response.status}: Unable to fetch data for ${cityName}`);
                    return null;
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error(`Failed to fetch data for ${cityName}:`, error);
                return null;
            }
        }
        

        initializeBubbles();
        
         // Implement search functionality
        d3.select("#search-btn").on("click", function() {
            const searchValue = d3.select("#search-input").property("value").toLowerCase();
            if (!searchValue) return; // If input is empty, do nothing

            // Reset all city colors and sizes
            svg.selectAll(".city")
                .style("fill", d => colorScale(d.temperature))
                .attr("r", 5); // Reset to default radius

            // Find the city by name and highlight the bubble
            const cityToSearch = cityData.find(d => d.city.toLowerCase() === searchValue || d.city.toLowerCase().includes(searchValue));
            if (cityToSearch) {
                const cityId = `city-${cityToSearch.city}`;
                const cityElement = d3.select(`#${cityId}`);

                // Change the bubble color to golden and increase its size
                cityElement.transition()
                    .duration(300) // Transition duration for size and color change
                    .attr("r", 10) // Increase the radius (size of the bubble)
                    .style("fill", "gold")
                    .on("mouseover", function() {
                        // On hover, revert to original color and size
                        const temperature = cityToSearch.temperature;
                        d3.select(this)
                            .style("fill", colorScale(temperature))
                            .attr("r", 5); // Revert to original size
                    })
                    .on("mouseout", function() {
                        const temperature = cityToSearch.temperature;
                        d3.select(this)
                            .style("fill", colorScale(temperature))
                            .attr("r", 5); // Revert to original size
                    });
            }
        });
        // Update the mouseover event on the city bubbles
svg.selectAll(".city")
.on("mouseover", function (event, d) {
    d3.select(this).attr("r", 8);
    
    // Call fetchWeather function when hovering over the city
    fetchWeather(d).then(data => {
        if (data && data.cod === 200) {
            // Populate the tooltip with actual weather data
            tooltip.html(`
                <strong>${d.city}, ${d.country}</strong><br>
                <strong>Temperature:</strong> ${data.main.temp}°C<br>
                <strong>Weather:</strong> ${data.weather[0].description}<br>
                <strong>Humidity:</strong> ${data.main.humidity}%<br>
                <strong>Wind Speed:</strong> ${data.wind.speed} m/s
            `)
            .style("display", "block")
            .style("left", `${event.pageX + 15}px`)
            .style("top", `${event.pageY - 30}px`);
        } else {
            // In case of error or no data, display a fallback message
            tooltip.html(`
                <strong>${d.city}, ${d.country}</strong><br>
                <em>Unable to fetch weather data</em>
            `)
            .style("display", "block")
            .style("left", `${event.pageX + 15}px`)
            .style("top", `${event.pageY - 30}px`);
        }
    });
})
.on("mousemove", (event) => {
    tooltip.style("left", `${event.pageX + 15}px`)
        .style("top", `${event.pageY - 30}px`);
})
.on("mouseout", function () {
    d3.select(this).attr("r", 5);
    tooltip.style("display", "none");
})
.on("click", async function (event, d) {
    tooltip.style("display", "none"); // Hide tooltip on click

    // Now fetch and display weather data upon click as well
    const weatherData = await fetchWeather(d);
    if (weatherData) {
        renderChart(d.city, weatherData);
    }
});

// Modify the fetchWeather function to use async/await properly
async function fetchWeather(city) {
const cityName = `${city.city},${city.country}`;
const url = `${apiUrl}${cityName}&appid=${apiKey}&units=metric`;

try {
    const response = await fetch(url);
    if (!response.ok) {
        console.error(`Error ${response.status}: Unable to fetch data for ${cityName}`);
        return null;
    }
    const data = await response.json();
    return data;
} catch (error) {
    console.error(`Failed to fetch data for ${cityName}:`, error);
    return null;
}
}
// Flag to check if the snow animation is running
let isSnowing = false;
function startSnowEffect() {
    if (isSnowing) return; // Don't start the snow again if it's already running
    isSnowing = true; // Set the flag to indicate that snow has started

    // Create snowflakes using a random position and falling animation
    const snowContainer = svg.append('g').attr('class', 'snow-container');

    // Generate a random number of snowflakes
    const numSnowflakes = 500;
    for (let i = 0; i < numSnowflakes; i++) {
        const snowflake = snowContainer.append('circle')
            .attr('class', 'snowflake')
            .attr('r', Math.random() * 3 + 2) // Random size between 2px and 5px
            .attr('cx', Math.random() * width) // Random horizontal position
            .attr('cy', Math.random() * height) // Random vertical position
            .style('fill', '#ffffff')
            .style('opacity', Math.random() * 0.5 + 0.3); // Random opacity

        // Start an infinite loop of the snowflakes falling
        snowflake.transition()
            .duration(Math.random() * 5000 + 5000) // Random falling speed
            .ease(d3.easeLinear)
            .attr('cy', height + 20) // Snowflakes fall off the screen
            .on('end', function () {
                // Reset position and restart the falling animation to loop indefinitely
                d3.select(this)
                    .attr('cy', -60) // Reset snowflake to the top
                    .transition()
                    .duration(Math.random() * 5000 + 5000) // Random falling speed
                    .ease(d3.easeLinear)
                    .attr('cy', height + 20)
                    .on('end', arguments.callee); // Recursively call to continue the loop
            });
    }
}

// You can stop the snow effect by calling this function whenever needed
function stopSnowEffect() {
    isSnowing = false;
    svg.select('.snow-container').remove(); // Remove snowflakes container
}


// Function to stop snow effect
function stopSnowEffect() {
    isSnowing = false; // Set the flag to stop snowing
    svg.selectAll('.snow-container').remove(); // Remove the snowflakes
}

// Handle filter clicks
d3.selectAll(".filter").on("click", function () {
    const range = d3.select(this).attr("data-range");

    // Stop snowing when any other filter is clicked
    if (range !== "below-0") {
        stopSnowEffect(); // Stop the snow effect
    }

    // Apply filtering logic
    filterCities(range);

    // Start snow effect if "Below 0°C" filter is selected
    if (range === "below-0") {
        startSnowEffect();
    }
});

// Update the rest of the code to handle filters and interactions as before...
// Flag to check if the cloud animation is running
let isCloudy = false;

function startCloudEffect() {
    if (isCloudy) return; // Don't start the clouds again if they're already running
    isCloudy = true; // Set the flag to indicate that clouds have started

    // Create cloud container
    const cloudContainer = svg.append('g').attr('class', 'cloud-container');

    // Generate a random number of clouds
    const numClouds = 10;
    for (let i = 0; i < numClouds; i++) {
        // Create cloud shapes
        const cloud = cloudContainer.append('circle')
            .attr('class', 'cloud')
            .attr('r', Math.random() * 50 + 30) // Random size for each cloud
            .attr('cx', Math.random() * width) // Random horizontal position
            .attr('cy', Math.random() * height / 2) // Random vertical position (in the upper half of the screen)
            .style('fill', '#b2bec3') // Light gray color for clouds
            .style('opacity', 0.5 + Math.random() * 0.3); // Random opacity for cloud variety

        // Move clouds from left to right (continuous loop)
        animateCloud(cloud);
    }
}

// Animate the cloud continuously
function animateCloud(cloud) {
    cloud.transition()
        .duration(Math.random() * 10000 + 10000) // Random duration for each cloud
        .ease(d3.easeLinear)
        .attr('cx', width + 100) // Clouds will move to the right
        .on('end', function () {
            // Reset position and restart the animation to loop indefinitely
            d3.select(this)
                .attr('cx', -1) // Reset to the left side
                .transition()
                .duration(Math.random() * 10000 + 10000) // Random duration for each cloud
                .ease(d3.easeLinear)
                .attr('cx', width + 100)
                .on('end', function () {
                    animateCloud(d3.select(this)); // Continue the animation loop
                });
        });
}

// Stop the cloud effect
function stopCloudEffect() {
    isCloudy = false; // Set the flag to stop cloud animation
    svg.select('.cloud-container').remove(); // Remove cloud container
}

// Handle filter clicks
d3.selectAll(".filter").on("click", function () {
    const range = d3.select(this).attr("data-range");

    // Stop snowing when any other filter is clicked
    if (range !== "below-0") {
        stopSnowEffect(); // Stop the snow effect
    }

    // Apply filtering logic
    filterCities(range);

    // Start snow effect if "Below 0°C" filter is selected
    if (range === "below-0") {
        startSnowEffect();
        // Reset the background to snowy
        d3.select("body").style("background", "linear-gradient(135deg, #89f7fe, #66a6ff)");
    }

    // Start cloud effect if "0-20°C" filter is selected
    if (range === "0-20") {
        // Start the cloud effect only if it's not already running
        if (!isCloudy) {
            startCloudEffect();
        }
        // Change background to cloudy
        d3.select("body").style("background", "linear-gradient(135deg, rgb(118, 134, 146), rgb(76, 81, 82))");
        
    }

    // Stop cloud effect for all other ranges
    if (range !== "0-20") {
        stopCloudEffect();
        // For other ranges, keep the default background
        d3.select("body").style("background", "linear-gradient(135deg, #89f7fe, #66a6ff)");
         // Default background
    }
    if (range === "20-40") {
        // Start the cloud effect only if it's not already running
        if (!isClearSky) {
            startClearSkyEffect();
        }
        // Change background to clearsky
        d3.select("body").style("background", "linear-gradient(135deg, #a2c2ff, #ffdf79)");
    }
    if (range !== "20-40") {
        stopClearSkyEffect();
        // For other ranges, keep the default background
        d3.select("body").style("background", "linear-gradient(135deg, #89f7fe, #66a6ff)"); // Default background
    }
});
// Flag to check if the clear sky effect is running
let isClearSky = false;
let sun; // Reference to the sun element to remove it later

// Function to start the clear sky effect
function startClearSkyEffect() {
    if (isClearSky) return; // Don't start the effect again if it's already running
    isClearSky = true; // Set the flag to indicate that the clear sky effect has started

    // Change the background to a clear sky effect
    d3.select("body")
        .style("background", "linear-gradient(135deg, #a2c2ff, #ffdf79)"); // Light sunny effect

    // Add the sun animation or other visual elements here
    sun = svg.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 4)
        .attr('r', 60)
        .style('fill', '#ffeb3b')
        .style('opacity', 0.8);

    // Animate the sun's position for a light movement (Optional)
    sun.transition()
        .duration(30000) // 30 seconds
        .ease(d3.easeLinear)
        .attr('cx', width / 1.5)
        .attr('cy', height / 4)
        .on('end', function () {
            d3.select(this).attr('cx', width / 2); // Reset the sun position
            startClearSkyEffect(); // Re-trigger the effect to loop the sun's path
        });
}

// Function to stop the clear sky effect
function stopClearSkyEffect() {
    if (sun) {
        sun.transition().duration(500).style('opacity', 0).remove(); // Fade out and remove the sun
        isClearSky = false; // Reset the flag
    }
    // Reset the background to a default state (before starting any new filter)
    d3.select("body").style("background", "white"); // Neutral background or you can choose a default one
}

// Flag to check if the heatwave animation is running
let isHot = false;

function startHeatwaveEffect() {
    if (isHot) return; // Don't start the heatwave again if it's already running
    isHot = true; // Set the flag to indicate that heatwave has started

    // Create heatwave container
    const heatwaveContainer = svg.append('g').attr('class', 'heatwave-container');

    // Generate shimmering heatwave circles
    const numWaves = 15; // Number of heatwave elements
    for (let i = 0; i < numWaves; i++) {
        const wave = heatwaveContainer.append('circle')
            .attr('class', 'heatwave')
            .attr('r', Math.random() * 30 + 20) // Random size for each wave
            .attr('cx', Math.random() * width) // Random horizontal position
            .attr('cy', Math.random() * height) // Random vertical position
            .style('fill', 'rgba(255, 100, 0, 0.4)') // Hot orange with transparency
            .style('opacity', 0.6); // Initial opacity

        // Animate shimmering effect
        wave.transition()
            .duration(2000)
            .ease(d3.easeSinInOut)
            .attr('r', Math.random() * 40 + 30) // Randomly increase size
            .style('opacity', 0) // Fade out gradually
            .on('end', function () {
                d3.select(this).remove(); // Remove the wave when animation ends
                if (isHot) {
                    startHeatwaveEffect(); // Recursively start new waves
                }
            });
    }
}

// Stop the heatwave effect
function stopHeatwaveEffect() {
    isHot = false; // Set the flag to stop heatwave animation
    svg.select('.heatwave-container').remove(); // Remove heatwave container
}

// Handle filter clicks
d3.selectAll(".filter").on("click", function () {
    const range = d3.select(this).attr("data-range");

    // Stop snowing when any other filter is clicked
    if (range !== "below-0") {
        stopSnowEffect(); // Stop the snow effect
    }

    // Stop cloud effect when any other filter is clicked
    if (range !== "0-20") {
        stopCloudEffect(); // Stop the cloud effect
    }

    // Stop heatwave effect when any other filter is clicked
    if (range !== "above-40") {
        stopHeatwaveEffect(); // Stop the heatwave effect
    }

    // Apply filtering logic
    filterCities(range);

    // Start snow effect if "Below 0°C" filter is selected
    if (range === "below-0") {
        startSnowEffect();
        // Reset the background to snowy
        d3.select("body").style("background", "linear-gradient(135deg, #89f7fe, #66a6ff)");
    }

    // Start cloud effect if "0-20°C" filter is selected
    if (range === "0-20") {
        if (!isCloudy) {
            startCloudEffect();
        }
        // Change background to cloudy
        d3.select("body").style("background", "linear-gradient(135deg, #bdc3c7, #95a5a6)");
    }
    if (range === "20-40") {
        // Start the cloud effect only if it's not already running
        if (!isClearSky) {
            startClearSkyEffect();
        }
        // Change background to clearsky
        d3.select("body").style("background", "linear-gradient(135deg, #a2c2ff, #ffdf79) !important");


    }
    if (range !== "20-40") {
        stopClearSkyEffect();
        // For other ranges, keep the default background
        d3.select("body").style("background", "linear-gradient(135deg, #89f7fe, #66a6ff)"); // Default background
    }

    // Start heatwave effect if "Above 40°C" filter is selected
    if (range === "above-40") {
        if (!isHot) {
            startHeatwaveEffect();
        }
        // Change background to extreme hot
        d3.select("body").style("background", "linear-gradient(135deg, #ff9a00, #ff3f00)");
    }

    // For all other ranges, reset to default background
    if (range !== "below-0" && range !== "0-20" && range !== "above-40") {
        d3.select("body").style("background", "linear-gradient(135deg, #89f7fe, #66a6ff)"); // Default background
    }
});



    });
});