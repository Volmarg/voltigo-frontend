<template>
  <div>
      <Accordion>
        <Panel :initially-open="!isPhoneBreakingPoint">
          <template #title>
            {{ $t('offersCount.accordion.label') }}
          </template>

          <template #content>
            <Container class="flex justify-center">
              <div class="grid grid-cols-1 count-grid sm:grid-cols-4">
                <span
                    class="single-data-block"
                    v-tippy="{
                      content: $t('offersCount.filteredOut.label'),
                      placement: 'top'
                    }"
                >
                  <la
                      svg-icon-name="ban-solid"
                      :font-size="icon.fontSize"
                      color="rgb(248, 113, 113)"
                  />

                  <span class="short-text">{{ $t('offersCount.filteredOut.short') }}: </span>
                  <span class="count">{{ filteredOutCount }}</span>
                </span>

                <span
                    class="single-data-block"
                    v-tippy="{
                      content: $t('offersCount.visible.label'),
                      placement: 'top'
                    }"
                >

                  <la
                      svg-icon-name="suitcase-solid"
                      :font-size="icon.fontSize"
                      color="rgb(5, 150, 105)"
                  />

                  <span class="short-text">{{ $t('offersCount.visible.short') }}: </span>
                  <span class="count">{{ visibleCount }}</span>
                </span>

                <span
                    class="single-data-block"
                    v-tippy="{
                      content: $t('offersCount.applied.label'),
                      placement: 'top'
                  }"
                >
                  <la svg-icon-name="envelope-open"
                      :font-size="icon.fontSize"
                      color="rgb(59, 130, 246)"
                  />

                  <span class="short-text">{{ $t('offersCount.applied.short') }}: </span>
                  <span class="count">{{ appliedCount }}</span>
                </span>

                <span
                    class="single-data-block"
                    v-tippy="{
                      content: $t('offersCount.totallyFound.label'),
                      placement: 'top'
                  }"
                >
                  <la svg-icon-name="search-solid"
                      :font-size="icon.fontSize"
                      color="rgb(59, 130, 246)"
                  />

                  <span class="short-text">{{ $t('offersCount.totallyFound.short') }}: </span>
                  <span class="count">{{ foundCount }}</span>
                </span>
              </div>
            </Container>
          </template>

        </Panel>
      </Accordion>

  </div>
</template>

<script lang="ts">
import {ComponentData}  from "@/scripts/Vue/Types/Components/types";

import ResponsiveVarsMixin from "@/mixins/Responsive/ResponsiveVarsMixin.vue";

import Container        from "@/components/Ui/Containers/Container.vue";
import Accordion        from "@/components/Ui/Accordion/Accordion.vue";
import Panel            from "@/components/Ui/Accordion/Panel.vue";

export default {
  data(): ComponentData {
    return {
      icon: {
        fontSize: 35, // px
      }
    }
  },
  props: {
    foundCount: {
      type: Number,
      required: true,
    },
    appliedCount: {
      type: Number,
      required: true,
    },
    visibleCount: {
      type: Number,
      required: true,
    }
  },
  computed: {
    /**
     * @description count of currently visible offers
     */
    filteredOutCount(): number {
      return this.foundCount - this.visibleCount;
    }
  },
  mixins: [
    ResponsiveVarsMixin
  ],
  components: {
    Panel,
    Accordion,
    Container,
  }
}
</script>

<style lang="scss" scoped>
.short-text {
  font-weight: bold;
}

.single-data-block {
  @apply ml-4  mt-4 sm:mt-0 relative
}

.count-grid {
  max-width: 600px;
}
</style>