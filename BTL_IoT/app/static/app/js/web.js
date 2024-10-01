function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
window.onload = function () {

var dps1 = []; // dataPoints for first line
var dps2 = []; // dataPoints for second line
var dps3 = []; // dataPoints for third line

var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    animationDuration: 2000, 
    title: {
    text: "BIỂU ĐỒ THEO DÕI CÁC CHỈ SỐ",
    fontFamily: "Verdana, Geneva, sans-serif", 
    fontSize: 24, 
    fontColor: "#2E8B57", 
    fontWeight: "bold", 
    horizontalAlign: "center", 
    verticalAlign: "top", 
    padding: 20 
    },
    axisX: {
        minimum: 0,
        labelFormatter: function () {
            return " "; 
        }
    },
    axisY: [{
        title: "Nhiệt độ (°C)",
        lineColor: "#C24642",
        tickColor: "#C24642",
        labelFontColor: "#C24642",
        titleFontColor: "#C24642",
        includeZero: false,
        interval: 10,
        minimum: 0,  
        maximum: 50  
    }, {
        title: "Độ ẩm (%)",
        lineColor: "#04bebd",
        tickColor: "#04bebd",
        labelFontColor: "#04bebd",
        titleFontColor: "#04bebd",
        includeZero: false,
        interval: 20,
        minimum: 0,   
        maximum: 100   
    }, {
        title: "Độ sáng (lux)",
        lineColor: "fdc667",
        tickColor: "#fdc667",
        labelFontColor: "#fdc667",
        titleFontColor: "#fdc667",
        includeZero: false,
        interval: 200,
        minimum: 0,   
        maximum: 1023  
    }],
    data: [{
        type: "line",
        showInLegend: true,
        name: "Nhiệt độ",
        dataPoints: dps1,
        axisYIndex: 0,
        color: "#C24642",
        markerType: "None",
        // markerType: "circle",  
    },
    {
        type: "line",
        showInLegend: true,
        name: "Độ ẩm",
        dataPoints: dps2,
        axisYIndex: 1,
        color: "#04bebd", 
        markerType: "None",
        // markerType: "circle",   
        // markerSize: 8          
    },
    {
        type: "line",
        showInLegend: true,
        name: "Độ sáng",
        dataPoints: dps3,
        axisYIndex: 2,
        color: "#fdc667",
        markerType: "None",   
        // markerSize: 8          
    }]
});
var xVal = 0;
var yVal1 = getRandomValue(10, 40); 
var yVal2 = getRandomValue(10, 90);
var yVal3 = getRandomValue(50, 900);

var dataLength = 20; 
 
    if (sessionStorage.getItem('chartData')) {
        const savedData = JSON.parse(sessionStorage.getItem('chartData'));
        savedData.dps1.forEach((item, index) => {
            dps1.push(item);
            dps2.push(savedData.dps2[index]);
            dps3.push(savedData.dps3[index]);
            xVal = Math.max(xVal, item.x); // Cập nhật xVal
        });
        chart.render(); 
    } 

var updateInterval = 2000;
var updateChart = function (count) {
    count = count || 1;

    fetch('sensor-data/') // Đường dẫn tới API 
        .then(response => response.json())
        .then(data => {
            
            const lastItem = data[data.length - 1];
            if (dps3.length > dataLength) {
                dps1.shift();
                dps2.shift();
                dps3.shift();
            }
            console.log(data); 
          
                dps1.push({ x: xVal, y: lastItem.temperature });
                dps2.push({ x: xVal, y: lastItem.humidity });
                dps3.push({ x:  xVal , y: lastItem.light_intensity });
                xVal += 2
            

                sessionStorage.setItem('chartData', JSON.stringify({
                    dps1: dps1,
                    dps2: dps2,
                    dps3: dps3
                }));
            // Cập nhật biểu đồ
            
            chart.options.axisX.viewportMinimum = xVal - dataLength * 2; 
            chart.options.axisX.viewportMaximum = xVal; 

            chart.render();

            // Cập nhật giá trị cho các ô hiển thị
            if (dps1.length > 0) {
                document.getElementById("value1").innerText = dps1[dps1.length - 1].y;
                document.getElementById("value2").innerText = dps2[dps2.length - 1].y;
                document.getElementById("value3").innerText = dps3[dps3.length - 1].y;

                // Thay đổi màu nền của các hộp hiển thị giá trị
                changeBackgroundColor_temperature("value1",dps1[dps1.length - 1].y);
                changeBackgroundColor_humidity("value2", dps2[dps2.length - 1].y);
                changeBackgroundColor_dust("value3", dps3[dps3.length - 1].y);
            }
        })
        .catch(error => console.error('Error fetching data:', error));

        
    
};

// Hàm thay đổi màu nền dựa trên giá trị
function changeBackgroundColor_temperature(elementId, value) {
    var element = document.getElementById(elementId).parentNode;
    
    var backgroundColor;

    if (value < 20) {
        backgroundColor = `#80e2e7`; // Xanh dương
    } else if (value >= 20 && value < 25) {
        backgroundColor = `#a1d97d`; // Xanh lá cây
    } else if(value >=25 && value < 30){
        backgroundColor = `#fcf471`; // Vàng
    } 
    else {
        backgroundColor = `#ff7168`; // Đỏ
    }

    element.style.backgroundColor = backgroundColor;
}

function changeBackgroundColor_humidity(elementId, value) {
    var element = document.getElementById(elementId).parentNode;
    
    var backgroundColor;

    if (value < 30) {
        backgroundColor = `#f0cdf2`; // Hồng nhạt
    } else if (value >= 30 && value < 45) {
        backgroundColor = `#d1edf9`; // xanh trắng
    } else if(value >= 45 && value <60){
        backgroundColor = `#7fceef`;// xanh nhạt
    } 
    else {
        backgroundColor = `#2ab4ed`; // Xanh đậm
    }

    element.style.backgroundColor = backgroundColor;
}

function changeBackgroundColor_dust(elementId, value) {
    var element = document.getElementById(elementId).parentNode;
    
    // Tính toán giá trị alpha dựa trên giá trị của biến value
    var backgroundColor;

    if (value < 12) {
        backgroundColor = `#f7f6e3`; // trắng
    } else if (value >= 0 && value < 100) {
        backgroundColor = `#f7f4b5`; // vàng nhẹ
    } else if (value >= 100 && value < 300) {
        backgroundColor = `#f6f184`; // vàng
    } else if (value >= 300 && value < 500) {
        backgroundColor = `#f7ed11`; // vàng đậm
    } else if (value >= 500 && value < 1000) {
        backgroundColor = `#eaa01f`; // cam
    } 
    else {
        backgroundColor = `#f7232c`; // đỏ
    }

    element.style.backgroundColor = backgroundColor;
}


updateChart(dataLength);
setInterval(function(){updateChart()}, updateInterval);

document.addEventListener('DOMContentLoaded', function() {
    const switches = document.querySelectorAll('.device-switch');

    switches.forEach(function(switchElem) {
        switchElem.addEventListener('change', function() {
            const deviceName = this.dataset.deviceName;
            const imgElem = document.getElementById(`device-img-${deviceName}`);
            
            console.log(`Switch for ${deviceName} changed. Checked: ${this.checked}`);
            // Lấy đường dẫn ảnh từ thuộc tính data-img-on và data-img-off
            const imgOn = imgElem.getAttribute('data-img-on');
            const imgOff = imgElem.getAttribute('data-img-off');

            // Kiểm tra trạng thái của switch và cập nhật hình ảnh
            if (this.checked) {
                imgElem.src = imgOn;
            } else {
                imgElem.src = imgOff;
            }
        });
    });
});


}
