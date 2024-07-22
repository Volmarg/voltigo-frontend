<template>
  <section class="pt-0">
    <div class="container">
      <div class="row justify-content-center">
        <div class="lg:w-8/12 pr-3 pl-3">
          <div class="title-box">
            <h2>{{ $t('infoPage.section.countries.header') }}</h2>
            <p>{{ $t('infoPage.section.countries.text') }}</p>
          </div>
        </div>
      </div>
      <div class="row">

        <div id="regions_div"
             class="w-full md:flex md:justify-center overflow-x-scroll md:overflow-auto"
        ></div>

      </div>
    </div>

    <small class="italic">{{ $t('infoPage.section.countries.caption') }}</small>
  </section>
</template>

<script lang="ts">
import PromiseService from "@/scripts/Core/Services/Promise/PromiseService";

export default {
  methods: {
    /**
     * @description loads the Google map charts script and then initialises the map (renders it)
     */
    loadAndInitialiseCountriesMap(): void {
      let googleMapScript = document.createElement('script');
      googleMapScript.id = "googleMapScript";

      googleMapScript.setAttribute('src', 'https://www.gstatic.com/charts/loader.js')
      document.head.appendChild(googleMapScript);

      // need to wait for external script to be loaded
      PromiseService.buildPeriodicallyCheckedPromise(() => {
        //@ts-ignore
        return !!document.getElementById('googleMapScript') && (typeof google !== "undefined");
      }).then(() => {
        this.initMap();
      })
    },
    /**
     * @description renders the Google map on page
     */
    initMap(): void {
      try {
        //@ts-ignore
        google.charts.load('current', {
          'packages': ['geochart'],
        });

        let drawRegionsMap = () => {
          //@ts-ignore
          var data = google.visualization.arrayToDataTable([
            ['Country'],
            ['Germany'],
            ['Poland'],
            ['Spain'],
            ['Norway'],
            ['France'],
            ['Sweden'],
          ]);

          var options = {
            defaultColor: 'rgb(142,174,233)',
          };

          //@ts-ignore
          var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

          chart.draw(data, options);
        }

        //@ts-ignore
        google.charts.setOnLoadCallback(drawRegionsMap);
      }catch (Error) {
          // nothing on purpose, catching vue crying that google is not defined but in the end it works fine
      }
    }
  },
  mounted(): void {
    this.loadAndInitialiseCountriesMap();
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/responsive.scss';

#regions_div {
  height: 500px;
}

@media screen and (max-width: $tabletBreakingPointPx + 'px') {
  #regions_div {
    height: 300px;
  }
}
</style>