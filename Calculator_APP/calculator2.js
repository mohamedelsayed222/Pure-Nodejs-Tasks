const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    const operation = parsedUrl.pathname.slice(1); 
    const { a, b } = parsedUrl.query;

    // Convert a and b to numbers
    const numA = Number(a);
    const numB = Number(b);

    // Validate numbers
    if (isNaN(numA) || isNaN(numB)) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("Both a and b must be valid numbers.");
    }

    let result;

    switch (operation) {
        case "add":
            result = numA + numB;
            break;
        case "subtract":
            result = numA - numB;
            break;
        case "multiply":
            result = numA * numB;
            break;
        case "divide":
            if (numB === 0) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                return res.end("Cannot divide by zero.");
            }
            result = numA / numB;
            break;
        default:
            res.writeHead(404, { "Content-Type": "text/plain" });
            return res.end("Invalid operation. Use add, subtract, multiply, or divide.");
    }

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`Result: ${result}`);
});

// Start server
server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
