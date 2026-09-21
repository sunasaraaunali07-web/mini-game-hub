#!/usr/bin/env python3
"""
====================================================================
🎮 Mini Game Hub — One-Click Master Launcher
====================================================================
This Python script allows you to launch, preview, and share the
Mini Game Hub web application with a single command:

    python main.py

Features:
- Automatically verifies and builds project assets if needed
- Starts a fast, lightweight local web server
- Automatically opens your web browser
- Provides a local Wi-Fi link so phones/tablets on your network can play
- Can create an instant public HTTPS shareable link for friends!
====================================================================
"""

import os
import sys
import time
import socket
import urllib.request
import subprocess
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler
import socketserver

# Ensure UTF-8 output on Windows consoles
if sys.platform.startswith("win"):
    try:
        if sys.stdout.encoding.lower() != 'utf-8':
            sys.stdout.reconfigure(encoding='utf-8')
        if sys.stderr.encoding.lower() != 'utf-8':
            sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Directory settings
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(PROJECT_DIR, "dist")
DEFAULT_PORT = 8080

def print_banner():
    banner = r"""
  __  __ _       _    ____                            _   _       _     
 |  \/  (_)_ __ (_)  / ___| __ _ _ __ ___   ___      | | | |_   _| |__  
 | |\/| | | '_ \| | | |  _ / _` | '_ ` _ \ / _ \     | |_| | | | | '_ \ 
 | |  | | | | | | | | |_| | (_| | | | | | |  __/     |  _  | |_| | |_) |
 |_|  |_|_|_| |_|_|  \____|\__,_|_| |_| |_|\___|     |_| |_|\__,_|_.__/ 
    """
    print("\033[96m" + banner + "\033[0m")
    print("\033[1;32m  [*] The All-in-One Mini Game Hub Launcher\033[0m")
    print("  " + "─" * 56 + "\n")

def get_lan_ip():
    """Detect the local machine's IP address on the Wi-Fi network."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def get_public_ip():
    """Fetch external IP (used as password for localtunnel)."""
    services = [
        "https://loca.lt/mytunnelpassword",
        "https://ipv4.icanhazip.com",
        "https://api.ipify.org"
    ]
    for url in services:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'MiniGameHub-Launcher'})
            with urllib.request.urlopen(req, timeout=4) as response:
                ip = response.read().decode('utf-8').strip()
                if ip:
                    return ip
        except Exception:
            continue
    return "Unavailable"

def find_available_port(start_port=DEFAULT_PORT):
    """Find the first open port starting from start_port."""
    port = start_port
    while port < 65535:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return port
            port += 1
    return start_port

def run_command(cmd, cwd=PROJECT_DIR):
    """Run a shell command portably across Windows and Unix."""
    try:
        return subprocess.run(cmd, shell=True, cwd=cwd, check=True)
    except subprocess.CalledProcessError as e:
        print(f"\033[91mCommand failed with exit code {e.returncode}: {cmd}\033[0m")
        return None

def ensure_built():
    """Check if dist folder exists, and build if missing."""
    index_path = os.path.join(DIST_DIR, "index.html")
    if not os.path.exists(index_path):
        print("\033[93m[*] Production build not found. Building project now...\033[0m")
        npm_cmd = "npm.cmd" if sys.platform.startswith("win") else "npm"
        run_command(f"{npm_cmd} run build")
        print("\033[92m[+] Build complete!\033[0m\n")

class SPAHandler(SimpleHTTPRequestHandler):
    """HTTP handler with proper MIME types and Single Page App fallback."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def log_message(self, format, *args):
        # Suppress routine GET request logs for a clean console experience
        pass

def start_localtunnel(port):
    """Start localtunnel in the background and print the shareable URL."""
    npm_cmd = "npx.cmd" if sys.platform.startswith("win") else "npx"
    cmd = [npm_cmd, "-y", "localtunnel", "--port", str(port)]
    
    try:
        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        
        tunnel_url = None
        for line in proc.stdout:
            line = line.strip()
            if "your url is:" in line.lower():
                tunnel_url = line.split(":")[-1].strip()
                if not tunnel_url.startswith("http"):
                    # reconstruct full URL
                    parts = line.split("your url is:", 1)
                    if len(parts) > 1:
                        tunnel_url = parts[1].strip()
                break
        
        if tunnel_url:
            public_ip = get_public_ip()
            print("\n\033[1;35m" + "═" * 58 + "\033[0m")
            print("  🌐 \033[1;36mPUBLIC SHAREABLE LINK FOR FRIENDS\033[0m")
            print(f"  🔗 URL:      \033[1;32m{tunnel_url}\033[0m")
            print(f"  🔑 Password: \033[1;33m{public_ip}\033[0m (enter this on the page)")
            print("  Send both the link and password to your friend!")
            print("\033[1;35m" + "═" * 58 + "\033[0m\n")
        else:
            print("\033[93mNotice: Could not retrieve public tunnel URL.\033[0m")
            
        proc.wait()
    except Exception as err:
        print(f"\033[91mTunnel error: {err}\033[0m")

def serve_local(port, enable_share=False):
    """Start local HTTP server and optionally spawn the public tunnel."""
    ensure_built()
    
    lan_ip = get_lan_ip()
    local_url = f"http://localhost:{port}"
    lan_url = f"http://{lan_ip}:{port}"

    print("\033[1;32m[+] Server is running!\033[0m")
    print(f"  🏠 \033[1mLocal Browser:\033[0m     \033[96m{local_url}\033[0m")
    print(f"  📶 \033[1mWi-Fi Network:\033[0m     \033[96m{lan_url}\033[0m (open on your phone!)")
    
    if enable_share:
        print("\n\033[93m⏳ Creating public shareable link for friends...\033[0m")
        tunnel_thread = threading.Thread(target=start_localtunnel, args=(port,), daemon=True)
        tunnel_thread.start()

    # Automatically open in the user's default browser
    def open_browser():
        time.sleep(0.8)
        webbrowser.open(local_url)

    threading.Thread(target=open_browser, daemon=True).start()

    print("\n\033[90mPress Ctrl+C anytime to stop the server.\033[0m\n")

    # Start the HTTP server
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", port), SPAHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\033[1;33m[!] Server stopped. Goodbye!\033[0m")
    except Exception as e:
        print(f"\033[91mServer error: {e}\033[0m")

def run_dev_mode():
    """Run Vite development server with hot-reload enabled."""
    print("\033[1;36mStarting Vite Development Server with Hot-Reload...\033[0m")
    npm_cmd = "npm.cmd" if sys.platform.startswith("win") else "npm"
    run_command(f"{npm_cmd} run dev -- --host --open")

def run_tests():
    """Run automated unit tests."""
    print("\033[1;36mRunning Vitest Automated Tests...\033[0m")
    npm_cmd = "npm.cmd" if sys.platform.startswith("win") else "npm"
    run_command(f"{npm_cmd} test")

def interactive_menu():
    """Display an interactive menu if no command-line flag is given."""
    print_banner()
    print("Select an option:")
    print("  \033[1m[1]\033[0m Launch Game Hub (Local & Wi-Fi) \033[90m(Default)\033[0m")
    print("  \033[1m[2]\033[0m Launch Game Hub + \033[1;35mPublic Shareable Link for Friends\033[0m")
    print("  \033[1m[3]\033[0m Launch in Vite Dev Mode (with Hot-Reload for coding)")
    print("  \033[1m[4]\033[0m Run Automated Unit Tests (25 tests)")
    print("  \033[1m[5]\033[0m Rebuild Project Assets")
    print("  \033[1m[0]\033[0m Exit\n")

    try:
        choice = input("Enter choice [1-5, default: 1]: ").strip()
    except (EOFError, KeyboardInterrupt):
        print("\nExiting.")
        return

    if choice == "" or choice == "1":
        port = find_available_port(DEFAULT_PORT)
        serve_local(port, enable_share=False)
    elif choice == "2":
        port = find_available_port(DEFAULT_PORT)
        serve_local(port, enable_share=True)
    elif choice == "3":
        run_dev_mode()
    elif choice == "4":
        run_tests()
    elif choice == "5":
        npm_cmd = "npm.cmd" if sys.platform.startswith("win") else "npm"
        run_command(f"{npm_cmd} run build")
        print("\033[92m[+] Build complete!\033[0m")
    elif choice == "0":
        print("Goodbye!")
    else:
        print("\033[91mInvalid choice. Starting default launcher...\033[0m")
        port = find_available_port(DEFAULT_PORT)
        serve_local(port, enable_share=False)

def main():
    # Handle command-line arguments
    args = sys.argv[1:]

    if "--help" in args or "-h" in args:
        print_banner()
        print("Usage: python main.py [options]\n")
        print("Options:")
        print("  --share       Launch local server and generate a public internet link for friends")
        print("  --dev         Launch Vite dev server with hot-reload and open browser")
        print("  --test        Run all 25 automated unit tests")
        print("  --build       Rebuild production assets")
        print("  --port <num>  Specify a custom port (default: 8080)")
        print("  --help, -h    Show this help message\n")
        return

    custom_port = None
    if "--port" in args:
        try:
            port_index = args.index("--port") + 1
            custom_port = int(args[port_index])
        except (ValueError, IndexError):
            print("\033[91mError: Please provide a valid port number after --port\033[0m")
            return

    port = custom_port or find_available_port(DEFAULT_PORT)

    if "--dev" in args:
        print_banner()
        run_dev_mode()
    elif "--test" in args:
        print_banner()
        run_tests()
    elif "--build" in args:
        print_banner()
        npm_cmd = "npm.cmd" if sys.platform.startswith("win") else "npm"
        run_command(f"{npm_cmd} run build")
        print("\033[92m[+] Build complete!\033[0m")
    elif "--share" in args:
        print_banner()
        serve_local(port, enable_share=True)
    elif len(args) == 0:
        interactive_menu()
    else:
        print_banner()
        serve_local(port, enable_share=False)

if __name__ == "__main__":
    main()
