import http from 'http';
import {app} from "./app";

const PORT = process.env.PORT || 4500;

const server = http.createServer(app);

server.listen(PORT, () => {
	console.log(`Site running at http://localhost:${PORT}`);
})
