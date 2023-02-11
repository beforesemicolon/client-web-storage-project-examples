export const promptInput = (label: string, value = '') => window.prompt(label, value) ?? '';

export const confirmAction = (label: string, value = '') => window.confirm(label) ?? '';