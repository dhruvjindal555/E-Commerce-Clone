import { motion } from "framer-motion";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"
        ></motion.div>
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg font-medium">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
