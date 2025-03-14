<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th v-for="(header, index) in headers"
              :key="index"
              class="font-bold uppercase"
          >{{ header.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rowData, rowIndex) in visibleResults"
            :key="rowIndex"
        >
          <td v-for="(cellData, cellIndex) in rowData"
              :key="cellIndex"
          >
            <component v-if="cellData.isComponent"
                       :is="cellData.value"
                       v-bind="cellData.componentProps"
            />
            <span v-else>
              {{ cellData.value }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <pagination :number-of-results="rowsData.length"
                :initial-current-page="currentPage"
                :initial-count-of-result-per-page="resultsPerPage"
                @page-number-changes="onPaginationPageNumberChange"
    />
  </div>
</template>

<script lang="ts">
import TypeChecker          from "@/scripts/Core/Services/Types/TypeChecker";
import Logger               from "@/scripts/Core/Logger";
import ObjectValuesResolver from "@/scripts/Core/Services/Resolver/ObjectValuesResolver";
import {ComponentData}      from "@/scripts/Vue/Types/Components/types";

import Pagination from "@/components/Ui/Pagination.vue";

/**
 * @description provides simple table
 * @warning     all of the extensive validations are needed because Vue is not recognizing types
 *              passed in prop, nor it allows using types on props so without it the props structure
 *              must be validated explicitly.
 *
 * @link https://vuejs.org/v2/guide/components-slots.html#Dynamic-Slot-Names - in case of need to provide slots for each cell
 */
export default {
  name: "SimpleTable",
  data(): ComponentData {
    return {
      currentPage: 1,
      visibleResults: [],
    }
  },
  props: {
    resultsPerPage: {
      type     : Number,
      required : false,
      default  : 10,
    },
    /**
     * @example
     * [
     *    {
     *      label                   : "Job name",
     *      dataValuePath       : "title.value",
     *      dataIsComponentPath : "title.isComponent",
     *    },
     *    {
     *      label                   : "Status",
     *      dataValuePath       : "icon.value",
     *      dataIsComponentPath : "icon.isComponent",
     * ]
     */
    headers: {
      type     : Array,
      required : true,
      validator(elements: Array<Record<string, unknown>>): boolean {
        let genericErrorCallback = () => {
          Logger.info("Validation for property `header` has failed, check it's description for more information.");
        }

        for(let element of elements){
          if( TypeChecker.isUndefined(element.label) ){
            Logger.error("Element from `headers` is missing property `label`", {
              element: element
            });
            genericErrorCallback();
            return false;
          }

          if( TypeChecker.isUndefined(element.dataValuePath) ){
            Logger.error("Element from `headers` is missing property `dataValuePath`", {
              element: element
            });
            genericErrorCallback();
            return false;
          }

          if( TypeChecker.isUndefined(element.dataIsComponentPath) ){
            Logger.error("Element from `headers` is missing property `dataIsComponentPath`", {
              element: element
            });
            genericErrorCallback();
            return false;
          }

          if( TypeChecker.isUndefined(element.dataComponentPropertiesPath) ){
            Logger.error("Element from `headers` is missing property `dataIsComponentPath`", {
              element: element
            });
            genericErrorCallback();
            return false;
          }
        }

        return true;
      }
    },
    /**
     * @description data used to build table rows
     * @example
     * [{
     *    values : {
     *      title : {
     *        value       : offerData.jobOffer.details.title,
     *        isComponent : false,
     *       },
     *      icon  : {
     *        value          : "Checkmark",
     *        isComponent    : true,
     *        componentProps : {}
     *      },
     *     },
     *}]
     */
    data: {
      type     : Array,
      required : true,
      validator(elements: Array<Record<string, Record<string, Record<string, unknown>>>>): boolean {
        let genericErrorCallback = () => {
          Logger.info("Validation for property `data` has failed, check it's description for more information.");
        }

        for(let element of elements){
          if( TypeChecker.isUndefined(element.values) ){
            Logger.error("Element from `data` is missing property `values`", {
              element: element
            });
            genericErrorCallback();
            return false;
          }

          if( !TypeChecker.isObject(element.values) ){
            Logger.error("Property called `values` from element of `data` property` is not an object!", {
              element: element
            });
            genericErrorCallback();
            return false;
          }

          for(let objectKey of Object.keys(element.values)){
            let objectValue = element.values[objectKey];

            if( TypeChecker.isUndefined(objectValue.value) ){
              Logger.error("`values` property (object property) of an element in `data` property (vue property) is missing key `value`", {
                element     : element,
                objectValue : objectValue,
              });
              genericErrorCallback();
              return false;
            }

            if( TypeChecker.isUndefined(objectValue.isComponent) ){
              Logger.error("`values` property (object property) of an element in `data` property (vue property) is missing key `isComponent`", {
                element     : element,
                objectValue : objectValue,
              });
              genericErrorCallback();
              return false;
            }

            if(
                    objectValue.isComponent
                &&  TypeChecker.isUndefined(objectValue.componentProps)
            ){
              Logger.error("Table element `data` property has incorrect structure", {
                reason      : "One of the element.value object is a component but that object is missing property `componentProps`",
                element     : element,
                objectValue : objectValue,
              });
              genericErrorCallback();
              return false;
            }

          }
        }

        return true;
      }
    }
  },
  components: {
    "pagination": Pagination,
  },
  computed: {
    /**
     * @description will return table rows data
     *              - real cell values are resolved from data(prop) via provided properties in headers(prop)
     */
    rowsData(): Array<Array<Record<string, unknown>>> {
      let rowsData = [] as Array<Array<Record<string, unknown>>>;
      for(let element of this.data){

        let rowData = [] as Array<Record<string, unknown>>;
        for(let header of this.headers){
          let keys = [
              header.dataValuePath,
              header.dataIsComponentPath,
              header.dataComponentPropertiesPath,
          ];
          let resolvedValues = ObjectValuesResolver.resolveKeysToValues(element.values, keys);
          let value          = resolvedValues[header.dataValuePath];
          let isComponent    = resolvedValues[header.dataIsComponentPath];
          let componentProps = resolvedValues[header.dataComponentPropertiesPath] ?? null;

          rowData.push({
            value          : value,
            isComponent    : isComponent,
            componentProps : componentProps
          })
        }

        rowsData.push(rowData);
      }

      return rowsData;
    }
  },
  methods: {
    /**
     * @description will handle the event when page number changes on pagination
     */
    onPaginationPageNumberChange(currentPage: number, countOfResultsPerPage: number): void {
      this.currentPage = currentPage;
      this.filterShownResults(currentPage, countOfResultsPerPage);
    },
    /**
     * @description will filter the results shown on page
     */
    filterShownResults(currentPage: number, countOfResultsPerPage: number): void {
      let visibleResults = [] as Array<unknown>;
      this.$nextTick( () => {
        let resultOffset = (currentPage-1) * countOfResultsPerPage;
        let resultsCount = 0;

        for(let rowData of this.rowsData){
          resultsCount++;

          if(resultsCount <= resultOffset){
            continue;
          }

          visibleResults.push(rowData);
          if(visibleResults.length >= countOfResultsPerPage){
            break;
          }
        }

        this.visibleResults = visibleResults;
      })
    },
  },
  created(): void {
    this.filterShownResults(this.currentPage, this.resultsPerPage);
  }
}
</script>