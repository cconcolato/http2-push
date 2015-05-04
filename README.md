# http2-push
Simple Client/Server test for XHR on Pushed Promises

The server is a simple HTTP/2 server running on localhost, based on NodeJS and its http2 module. It responds to simple queries like '''https://localhost:8091/file1.txt''' or to queries such as '''https://localhost:8091/file1.txt?push=file2.txt''' pushing file2.txt as a Push Promise when file1.txt is requested. 

Run with "node node-http2-push-server.js". 

The client code uses simple XHR to fetch first https://localhost:8091/file1.txt?push=file2.txt&push=file3.txt and then to fetch file2 and file3 separately. The 2nd and 3rd XHR should not reach the server and the resource should be fetched from the client's cache if the client supports HTTP/2.

Open "client.html" in a browser. Tested with Chrome Canary 42 (32-bit, Windows).
