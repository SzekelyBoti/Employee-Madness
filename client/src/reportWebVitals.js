/**
 * @brief Initializes web vitals performance monitoring for the application.
 *
 * @param {Function} onPerfEntry - Optional callback function that receives performance entries.
 *
 * This function sets up web vitals reporting by importing the web-vitals library
 * and registering callback functions for various performance metrics. It only
 * initializes if a valid callback function is provided.
 *
 * The web vitals measured include:
 * - CLS (Cumulative Layout Shift): Measures visual stability
 * - FID (First Input Delay): Measures interactivity
 * - FCP (First Contentful Paint): Measures loading performance
 * - LCP (Largest Contentful Paint): Measures loading performance
 * - TTFB (Time to First Byte): Measures server response time
 *
 * @note This function uses dynamic imports to avoid loading the web-vitals
 *       library unless performance monitoring is actually needed.
 */
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
