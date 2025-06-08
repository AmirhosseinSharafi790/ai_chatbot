import { toast } from "react-toastify";

const handleCopy = () => {
const text = "http://localhost:3000/";
    navigator.clipboard.writeText(text);
    toast.success("لینک کپی شد!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeButton: false,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
});
};
export default handleCopy