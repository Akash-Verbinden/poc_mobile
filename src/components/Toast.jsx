
import Toast from "react-native-toast-message";

const ToastView = {
    success: (message, title = "Success") => {
        Toast.show({
            type: "success",
            text1: title,
            text2: message,
            position: "top",
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 100,
            props: {
            text2NumberOfLines: 0, // 👈 allow wrapping
        },
        });
    },

    error: (message, title = "Error") => {
        Toast.show({
            type: "error",
            text1: title,
            text2: message,
            position: "top",
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 100,
            props: {
            text2NumberOfLines: 0, // 👈 allow wrapping
        },
        });
    },

    info: (message, title = "Info") => {
        Toast.show({
            type: "info",
            text1: title,
            text2: message,
            position: "top",
            visibilityTime: 3000,
            autoHide: true,
        });
    },
};

export default ToastView;
