<template>
  <div class="flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
    <ProblemsPanelHeader
      v-model="activeFilter"
      :total="allDiagnostics.length"
      :error-count="errors.length"
      :warning-count="warnings.length"
      :info-count="infos.length"
      :auto-fixable="autoFixableCount"
    />

    <div
      class="flex-1 overflow-y-auto"
    >
      <div
        v-if="filteredDiagnostics.length === 0"
        class="flex items-center justify-center py-8 text-xs text-gray-400"
      >
        No problems
      </div>
      <ProblemEntry
        v-for="item in filteredDiagnostics"
        :key="`${item.diagnostic.location.line}:${item.diagnostic.location.column}:${item.severity}:${item.diagnostic.message}`"
        :diagnostic="item.diagnostic"
        :severity="item.severity"
        :expanded="expandedDiag === item.diagnostic"
        @click="onEntryClick(item)"
        @apply-fix="emit('apply-fix', { diagnostic: item.diagnostic, fix: $event })"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type {
  ParserDiagnostic, QuickFixAction, DiagnosticSeverity, DiagnosticFilter,
} from '@/types';
import ProblemsPanelHeader from '@/components/panes/editor/problems/ProblemsPanelHeader.vue';
import ProblemEntry from '@/components/panes/editor/problems/ProblemEntry.vue';

interface DiagnosticItem {
  diagnostic: ParserDiagnostic;
  severity: DiagnosticSeverity;
}

const props = defineProps<{
  errors: readonly ParserDiagnostic[];
  warnings: readonly ParserDiagnostic[];
  infos: readonly ParserDiagnostic[];
}>();

const emit = defineEmits<{
  'diagnostic-jump': [diag: ParserDiagnostic];
  'apply-fix': [payload: { diagnostic: ParserDiagnostic; fix: QuickFixAction }];
}>();

const activeFilter = ref<DiagnosticFilter>('all');
const expandedDiag = ref<ParserDiagnostic | null>(null);

watch(activeFilter, () => { expandedDiag.value = null; });
watch([() => props.errors.length, () => props.warnings.length, () => props.infos.length], ([e, w, i]) => {
  if (activeFilter.value === 'error' && e === 0) activeFilter.value = 'all';
  if (activeFilter.value === 'warning' && w === 0) activeFilter.value = 'all';
  if (activeFilter.value === 'info' && i === 0) activeFilter.value = 'all';
});

const allDiagnostics = computed<DiagnosticItem[]>(() => {
  const items: DiagnosticItem[] = [];
  for (const d of props.errors) items.push({ diagnostic: d, severity: 'error' });
  for (const d of props.warnings) items.push({ diagnostic: d, severity: 'warning' });
  for (const d of props.infos) items.push({ diagnostic: d, severity: 'info' });
  items.sort((a, b) => a.diagnostic.location.line - b.diagnostic.location.line || a.diagnostic.location.column - b.diagnostic.location.column);
  return items;
});

const filteredDiagnostics = computed(() => {
  if (activeFilter.value === 'all') return allDiagnostics.value;
  return allDiagnostics.value.filter((d) => d.severity === activeFilter.value);
});

const autoFixableCount = computed(() =>
  allDiagnostics.value.filter((d) => d.diagnostic.quickFixes?.length).length,
);

function onEntryClick (item: DiagnosticItem) {
  emit('diagnostic-jump', item.diagnostic);
  const hasDetails = !!(item.diagnostic.explanation || item.diagnostic.quickFixes?.length);
  if (hasDetails) {
    expandedDiag.value = item.diagnostic;
  }
}
</script>
