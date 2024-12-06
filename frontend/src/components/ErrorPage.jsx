const ErrorPage = () => {
    return (
        <div className="error-page">
            <h1 className="flex justify-center  text-3xl font-semibold text-white py-4">
                Error 404
            </h1>
            <p className="flex justify-center  text-xl text-white py-2">
                Page Not Found
            </p>  
            <p className="flex justify-center  text-xl text-white ">
                Sorry, the page you are looking for does not exist.
            </p>  
        </div>
    )
}
export default ErrorPage