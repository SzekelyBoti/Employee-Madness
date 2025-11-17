import { useRouteError, useNavigate } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();

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

