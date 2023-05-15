import http.server as server
import socketserver
PORT = 80

class Handler(server.BaseHTTPRequestHandler):
    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type','text/html')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        message = "Hello World! Received form data."
        self.wfile.write(bytes(message, "utf8"))
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        print(self.path)
        print(self.command)
        print(self.request_version)
        print(self.client_address)
        print(self.headers)
        print(post_data)
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','text/html')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        message = "Hello World!"
        self.wfile.write(bytes(message, "utf8"))
        print(self.path)
        print(self.command)
        print(self.request_version)
        print(self.client_address)
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.end_headers()
        print(self.path)
        print(self.command)
        print(self.request_version)
        print(self.client_address)

with socketserver.TCPServer(("", PORT), Handler) as server:
    print("serving at port", PORT)
    server.serve_forever()

