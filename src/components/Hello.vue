<template>
  <div class="hello">
      <el-tabs v-model="activeName" @tab-click="handleClick">
  <el-tab-pane label="Today" name="Current">  
            <div id="app" :class="typeof weather.main != 'undefined' && (weathers == null) ? 'null' : 
                                                                        (weathers == 'Clouds') ? 'cloud' : 
                                                                        (weathers == 'Clear') ? 'clear' : 
                                                                        (weathers == 'Haze') ? 'cloud' :
                                                                         (weathers == 'Thunderstorm') ? 'thunder' :
                                                                        (weathers == 'Rain') ? 'rain' : 'not found'">
    <main>
      <div class="search-box">
        <input 
          type="text" 
          class="search-bar" 
          placeholder="Search..."
          v-model="query"
          @keypress="fetchWeather"
        />
      </div>
      <!-- <el-row>
  <el-col :span="8" >
   <el-card :body-style="{ padding: '0px' }"> -->
       <div class="weather-wrap" v-if="typeof weather.main != 'undefined'">
        <div class="location-box">
          <div class="location">{{ weather.name }}, {{ weather.sys.country }}</div>
          <div class="date">{{ dateBuilder() }}</div>
        </div>

        <div class="weather-box">
          <div class="temp">{{ weather.main.temp }}°c</div>
          <div class="weather">{{ weather.weather[0].main }}</div>
        </div>
      </div>
    <!-- </el-card>
  </el-col>
      </el-row> -->
    </main>
  </div>
      </el-tab-pane>
    <el-tab-pane label="Week" name="Summary">
          <div class="container">
          <el-col :span="24" class="toolbar">
      <el-form :inline="true">
        <el-form-item>
          <el-input placeholder="Enter Location" v-model="input2"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" v-on:click="greet">Search</el-button>


        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24" v-if="show">
      <el-button type="primary">{{city}} </el-button>
            <el-button type="primary">{{country}}</el-button>

    </el-col>
    <el-col :span="24" v-if="show">
      <el-table
        :data="gridData"
        stripe
        fit
        style="width: 80% ;text-align: center;">
        <el-table-column
          align="center"
          prop="dt"
          label="Date">
        </el-table-column>
        <el-table-column
          align="center"
          prop="weather.main"
          label="Weather">
        </el-table-column>
        <el-table-column
          align="center"
          prop="temp.day"
          label="DayTime Temperature in (°C)">
        </el-table-column>
        <el-table-column
          align="center"
          prop="temp.night"
          label="NightTime Temperature (°C)">
        </el-table-column>
        <el-table-column
          align="center"
          prop="pressure"
          label="Atmospheric pressure in (pha)">
        </el-table-column>
        <el-table-column
          align="center"
          prop="weather.icon"
          label="Weather Conditions">
          <template scope="scope">
              <img :src="scope.row.weather.icon" />
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </div>
    </el-tab-pane>
    <el-tab-pane label="Today Details" name="second">  
            <div class="container">
      <div class="my-5">
        <form v-on:submit.prevent="getData">
          <div class="row">
            <div class="col-md-6 offset-md-3">
              <div class="input-group">
                <input type="text" placeholder="Enter location" class="form-control" v-model="city" />
                <div class="input-group-append">
                  <button class="btn btn-primary"  type="submit">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="my-5">
        <div class="alert alert-info" v-show="loading">
          Loading...
        </div>
        <div v-show="chart != null">
          <canvas id="myChart"></canvas>
        </div>
      </div>
    </div>
      </el-tab-pane>
    
  </el-tabs>    


  </div>
</template>

<script>
import Chart from "chart.js";
import axios from "axios";

export default {
  name: 'hello',
  data () {
    return {
      activeName: 'Current',
      input2:null,
      show:false,
      gridData:[],
      city:null,
      country:null,
      chart: null,
      city: "",
      dates: [],
      temps: [],
      loading: false,
      errored: false,
      api_key: 'fd3150a661c1ddc90d3aefdec0400de4',
      url_base: 'https://api.openweathermap.org/data/2.5/',
      query: '',
      weather: {},
      weathers: null,
    }
  },
  methods: {
        handleClick(tab, event) {
        console.log(tab, event);
      },
      greet: function() {
						this.$http.get(`http://api.openweathermap.org/data/2.5/forecast/daily?q=${this.input2}&mode=json&units=metric&cnt=8&appid=f12159c1f548ea9ab7b5ff1907b1df50`)
							.then((response) => {
                this.city=response.data.city.name;
                this.country=response.data.city.country;
               this.gridData=response.data.list
               console.log(this.gridData);
               for(let i=0;i<this.gridData.length;i++){
                //  this.gridData[i].img= '<img src="http://openweathermap.org/img/w/'+this.gridData[i].weather[0].icon+'.png">'
                 this.gridData[i].weather.main=this.gridData[i].weather[0].main

                 this.gridData[i].weather.icon= 'http://openweathermap.org/img/w/' + this.gridData[i].weather[0].icon + '.png';

                 var date = new Date(this.gridData[i].dt*1000);
                 this.gridData[i].dt = `${date.getFullYear()}-${date.getMonth() +1}-${date.getDate()}`
               }

               this.show = true
							})
							.catch(function(response) {
								console.log(response)
							})
          },
          getData: function() {
      this.loading = true;

      if (this.chart != null) {
        this.chart.destroy();
      }

      axios
        .get("https://api.openweathermap.org/data/2.5/forecast", {
          params: {
            q: this.city,
            units: "imperial",
            appid: "fd3150a661c1ddc90d3aefdec0400de4"
          }
        })
        .then(response => {
          this.dates = response.data.list.map(list => {
            return list.dt_txt;
          });

          this.temps = response.data.list.map(list => {
            return list.main.temp;
          });
          console.log(this.dates)
          var ctx = document.getElementById("myChart");
          this.chart = new Chart(ctx, {
            type: "line",
            data: {
              labels: this.dates,
              datasets: [
                {
                  label: "Avg. Temp",
                  backgroundColor: "#fffff",
                  borderColor: "rgb(54, 162, 235)",
                  fill: false,
                  data: this.temps
                }
              ]
            },
            options: {
              title: {
                display: true,
                text: "Temperature with chart"
              },
              tooltips: {
                callbacks: {
                  label: function(tooltipItem, data) {
                    var label =
                      data.datasets[tooltipItem.datasetIndex].label || "";

                    if (label) {
                      label += ": ";
                    }

                    label += Math.floor(tooltipItem.yLabel);
                    return label + "°F";
                  }
                }
              },
              scales: {
                xAxes: [
                  {
                    type: "time",
                    time: {
                      unit: "hour",
                      displayFormats: {
                        hour: "M/DD @ hA"
                      },
                      tooltipFormat: "MMM. DD @ hA"
                    },
                    scaleLabel: {
                      display: true,
                      labelString: "Date/Time"
                    }
                  }
                ],
                yAxes: [
                  {
                    scaleLabel: {
                      display: true,
                      labelString: "Temperature (°F)"
                    },
                    ticks: {
                      // eslint-disable-next-line no-unused-vars
                      callback: function(value, index, values) {
                        return value + "°F";
                      }
                    }
                  }
                ]
              }
            }
          });
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    },

      fetchWeather (e) {
      if (e.key == "Enter") {
        fetch(`${this.url_base}weather?q=${this.query}&units=metric&APPID=${this.api_key}`)
          .then(res => {
            return res.json();
          }).then(this.setResults);
      }
    },
    setResults (results) {
      this.weather = results;
      this.weathers = this.weather.weather[0].main ;
      console.log(this.weathers)
    },
    dateBuilder () {
      let d = new Date();
      let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      let day = days[d.getDay()];
      let date = d.getDate();
      let month = months[d.getMonth()];
      let year = d.getFullYear();

      return `${day} ${date} ${month} ${year}`;
    }
    },
   

}
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bounce-enter-active {
  animation:bounce-in .5s;
}
.bounce-leave-active{
  animation:bounce-out .5s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(0);
  }
}
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.el-table{
  margin:5% 10%;
}
.el-row {
    margin-bottom: 20px;

  }
  .el-row:last-child {
      margin-bottom: 0;
    }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  
#app.cloud {
  background-image: url('../assets/cloudy.jpg');
}
#app.clear {
  background-image: url('../assets/clear.jpg');
}
#app.rain {
  background-image: url('../assets/rain.jpg');
}
#app.thunder {
  background-image: url('../assets/thunder.jpg');
}
#app.null {
  background-image: url('../assets/null.png');
}


main {
  min-height: 100vh;
  padding: 25px;

  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.75));
}

.search-box {
  width: 100%;
  margin-bottom: 30px;
}

.search-box .search-bar {
  display: block;
  width: 100%;
  padding: 15px;
  
  color: #313131;
  font-size: 20px;

  appearance: none;
  border:none;
  outline: none;
  background: none;

  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 0px 16px 0px 16px;
  transition: 0.4s;
}

.search-box .search-bar:focus {
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 16px 0px 16px 0px;
}

.location-box .location {
  color: #FFF;
  font-size: 32px;
  font-weight: 500;
  text-align: center;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
}

.location-box .date {
  color: #FFF;
  font-size: 20px;
  font-weight: 300;
  font-style: italic;
  text-align: center;
}

.weather-box {
  text-align: center;
}

.weather-box .temp {
  display: inline-block;
  padding: 10px 25px;
  color: #FFF;
  font-size: 102px;
  font-weight: 900;

  text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
  background-color:rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  margin: 30px 0px;

  box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}

.weather-box .weather {
  color: #FFF;
  font-size: 48px;
  font-weight: 700;
  font-style: italic;
  text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}
</style>
