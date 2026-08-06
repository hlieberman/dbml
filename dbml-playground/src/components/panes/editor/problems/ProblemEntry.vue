<template>
  <div
    class="border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 select-none"
    @click="emit('click')"
  >
    <!-- Entry row -->
    <div class="flex items-start gap-2 px-3 py-2 text-sm">
      <span class="h-5 flex items-center flex-shrink-0">
        <span
          class="w-2 h-2 rounded-full"
          :class="SEVERITY_DOT[severity]"
        />
      </span>
      <span class="flex-1 text-gray-800">{{ diagnostic.message }}</span>
      <span class="text-gray-400 flex-shrink-0 tabular-nums">{{ diagnostic.location.line }}:{{ diagnostic.location.column }}</span>
    </div>

    <!-- Accordion content -->
    <div
      class="overflow-hidden transition-[max-height] duration-150 ease-in-out"
      :style="{ maxHeight: expanded && hasDetails ? '12rem' : '0' }"
    >
      <div class="px-3 pb-3 pt-0 ml-5">
        <div
          v-if="explanationHtml"
          class="text-xs text-gray-500 mt-1 explanation"
          v-html="explanationHtml"
        />
        <div
          v-if="diagnostic.quickFixes?.length"
          class="flex items-center gap-2 mt-2"
        >
          <VDropdown
            :distance="4"
            placement="bottom-start"
            :arrow-padding="0"
            no-auto-focus
          >
            <span
              class="text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              @click.stop
            >
              Apply fix
            </span>
            <template #popper>
              <div class="py-1 min-w-[10rem]">
                <button
                  v-for="(fix, fi) in diagnostic.quickFixes"
                  :key="fi"
                  class="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer"
                  @click="onApplyFix(fix)"
                >
                  {{ fix.title }}
                </button>
              </div>
            </template>
          </VDropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { SEVERITY_DOT } from '@/types';
import type { ParserDiagnostic, QuickFixAction, DiagnosticSeverity } from '@/types';
import { renderMarkdown } from '@/utils/markdown';

const props = defineProps<{
  diagnostic: ParserDiagnostic;
  severity: DiagnosticSeverity;
  expanded: boolean;
}>();

const hasDetails = computed(() => !!(props.diagnostic.explanation || props.diagnostic.quickFixes?.length));
const explanationHtml = computed(() => props.diagnostic.explanation ? renderMarkdown(props.diagnostic.explanation) : '');

const emit = defineEmits<{
  'click': [];
  'apply-fix': [fix: QuickFixAction];
}>();

function onApplyFix (fix: QuickFixAction) {
  emit('apply-fix', fix);
}
</script>

<style scoped>
.explanation :deep(code) {
  background: #f3f4f6;
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 0.85em;
}
.explanation :deep(p) {
  margin: 0;
}
.explanation :deep(ul) {
  margin: 4px 0 0;
  padding-left: 16px;
}
.explanation :deep(li) {
  margin: 2px 0;
}
</style>
