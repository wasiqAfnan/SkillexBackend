export const handleHealthCheck = (req, res) => {
    return res
        .status(200)
        .json({message: "Server is up and running"});
};