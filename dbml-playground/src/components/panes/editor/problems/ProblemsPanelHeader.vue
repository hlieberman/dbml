<template>
  <div class="flex items-center gap-3 px-3 py-2 border-b border-gray-200 flex-shrink-0">
    <div class="flex items-center gap-1.5">
      <span class="text-sm font-semibold text-gray-900">Problems</span>
      <span class="text-xs text-gray-500">{{ total }} in this file</span>
      <span
        v-if="autoFixable > 0"
        class="text-xs text-gray-400"
      >&middot; {{ autoFixable }} auto-fixable</span>
    </div>
    <div class="flex items-center gap-1 ml-auto">
      <button
        class="px-2 py-0.5 text-xs rounded transition-colors cursor-pointer"
        :class="modelValue === 'all' ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100'"
        @click="emit('update:modelValue', 'all')"
      >
        All {{ total }}
      </button>
      <button
        v-if="errorCount > 0"
        class="flex items-center gap-1 px-2 py-0.5 text-xs rounded transition-colors cursor-pointer"
        :class="modelValue === 'error' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:bg-gray-100'"
        @click="emit('update:modelValue', 'error')"
      >
        <span class="w-2 h-2 rounded-full bg-red-500" />
        {{ errorCount }}
      </button>
      <button
        v-if="warningCount > 0"
        class="flex items-center gap-1 px-2 py-0.5 text-xs rounded transition-colors cursor-pointer"
        :class="modelValue === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-500 hover:bg-gray-100'"
        @click="emit('update:modelValue', 'warning')"
      >
        <span class="w-2 h-2 rounded-full bg-yellow-400" />
        {{ warningCount }}
      </button>
      <button
        v-if="infoCount > 0"
        class="flex items-center gap-1 px-2 py-0.5 text-xs rounded transition-colors cursor-pointer"
        :class="modelValue === 'info' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'"
        @click="emit('update:modelValue', 'info')"
      >
        <span class="w-2 h-2 rounded-full bg-blue-500" />
        {{ infoCount }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DiagnosticFilter } from '@/types';

defineProps<{
  modelValue: DiagnosticFilter;
  total: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  autoFixable: number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: DiagnosticFilter];
}>();
</script>
