<template>
  <Accordion>
    <AccordionPanel>

      <template #title>
        {{ $t('builder.hints.header.label') }}
      </template>

      <template #content>

        <InformationBlock class="mb-5 bg-white text-gray-500 text-2md">
          <div class="text-left">
            <ul class="ml-5">
              <li class="mt-0-force list-disc">
                <span v-html="$t('builder.hints.gdpr.main')" />
                <span
                    v-html="$t('builder.hints.gdpr.example')"
                    class="italic"
                />
              </li>
            </ul>
          </div>
        </InformationBlock>

      </template>
    </AccordionPanel>
  </Accordion>
</template>

<script lang="ts">
import Accordion        from "@/components/Ui/Accordion/Accordion.vue";
import AccordionPanel   from "@/components/Ui/Accordion/Panel.vue";
import InformationBlock from "@/components/Page/InformationBlock.vue";

export default {
  components: {
    InformationBlock,
    AccordionPanel,
    Accordion
  }
}
</script>