import { useRouteError, useNavigate } from "react-router-dom";

/**
 * @brief Component for displaying error pages when routing fails.
 *
 * This component is used as an error boundary for React Router. It catches
 * and displays errors that occur during routing, such as:
 * - 404 page not found errors
 * - Network errors when loading routes
 * - Runtime errors in route components
 *
 * The component provides a user-friendly error message and a navigation
 * button to return to the home page.
 *
 * @returns {JSX.Element} The rendered error page component.
 */
const ErrorPage = () => {
    /**
     * @brief The routing error object provided by React Router.
     *
     * @type {Object}
     * @property {number} status - HTTP status code (if applicable).
     * @property {string} statusText - Status text description.
     * @property {string} message - Error message.
     */
    const error = useRouteError();

    /**
     * @brief React Router navigation hook for programmatic navigation.
     */
    const navigate = useNavigate();

    // Log the error to console for debugging
    console.error(error);

    return (
        <div id="error-page" style={{ padding: "2rem", textAlign: "center" }}>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message || "Unknown error"}</i>
            </p>
            <button onClick={() => navigate("/")}>Go Home</button>
        </div>
    );
};

export default ErrorPage;

