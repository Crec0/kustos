import { createToaster } from '@melt-ui/svelte';

export type ToastData = {
    title: string;
    description: string;
    color: string;
};

const {
    elements,
    helpers: { addToast },
    states: { toasts },
    actions: { portal },
} = createToaster<ToastData>();

const makeToast = (title: string, color: string, description: string) => {
    addToast({
        data: {
            title: title,
            color: color,
            description: description,
        },
        closeDelay: 10000,
    });
};

export const showSuccessToast = (desc: string) => makeToast('Success', 'success', desc);
export const showInfoToast = (desc: string) => makeToast('Info', 'info', desc);
export const showWarnToast = (desc: string) => makeToast('Warning', 'warn', desc);
export const showErrorToast = (desc: string) => makeToast('Error', 'error', desc);

export { elements as toastElements, portal as toastPortal, toasts };
