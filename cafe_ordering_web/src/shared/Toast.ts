import { toast } from 'react-toastify';

class Toast {
    static success(message?: string, options = {}) {
        toast.success(message ?? "success", options);
    }

    static error(message?: string, options = {}) {
        toast.error(message ?? "error", options);
    }

    static info(message: string, options = {}) {
        toast.info(message, options);
    }
}

export default Toast;
