<template>
  <row>
    <div class="grid grid-rows-2 md:grid-rows-1 w-full md:w-auto md:flex">
      <medium-button-with-icon :text="$t('builder.navigation.buttons.new')"
                               button-classes="w-full md:w-auto"
                               @click="onNewTemplateClick"
                               :disabled="hasReachedMaxTemplates"
      >
        <template #icon>
          <la svg-icon-name="file-alt"
              color="white"
          />
        </template>
      </medium-button-with-icon>

      <medium-button-with-icon :text="$t('builder.navigation.buttons.newPredefined')"
                               class="mt-1 md:mt-0"
                               button-classes="w-full md:w-auto"
                               @click="$emit('newPredefinedTemplate')"
                               v-if="userController.isDeveloper()"
      >
        <template #icon>
          <la svg-icon-name="file-alt"
              color="white"
          />
        </template>
      </medium-button-with-icon>


      <medium-button-with-icon :text="$t('builder.navigation.buttons.guide')"
                               class="mt-2 md:mt-0"
                               button-classes="w-full md:w-auto"
                               @click="$emit('showGuide')"
      >
        <template #icon>
          <la svg-icon-name="book-solid"
              color="white"
          />
        </template>
      </medium-button-with-icon>

    </div>
  </row>
</template>

<script lang="ts">
import MediumButtonWithIcon from "@/components/Navigation/Button/MediumButtonWithIcon.vue";
import LineAwesome          from "@/components/Ui/Icons/LineAwesome.vue";
import Row                  from "@/components/Ui/Row.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";
import UserController  from "@/scripts/Core/Controller/UserController";

export default {
  name: "EmailTemplateBuilderTopNavBar",
  data(): ComponentData {
    return {
      userController: new UserController(),
    }
  },
  props: {
    hasReachedMaxTemplates: {
      type: Boolean,
      required: true,
    }
  },
  emits: [
    'newTemplate',
    'newPredefinedTemplate',
    'showGuide'
  ],
  components: {
    MediumButtonWithIcon,
    Row,
    "la": LineAwesome,
  },
  methods: {
    /**
     * @description handler when user clicks on "New template"
     */
    onNewTemplateClick(): void {
      if (this.hasReachedMaxTemplates) {
        return;
      }

      this.$emit('newTemplate');
    }
  }
}
</script>