# K6 Setup and Run Guidance

This guide provides step-by-step instructions to set up and run K6 load tests on both Linux and Windows systems.

---

## Prerequisites
- Node.js (for some advanced scripting, but not required for basic K6 usage)
- Internet connection

---

## Installation

### Linux
1. **Install K6 using Homebrew (recommended for macOS/Linux):**
   ```sh
   brew install k6
   ```
   
   **Or, install using apt (Debian/Ubuntu):**
   ```sh
   sudo apt update
   sudo apt install gnupg software-properties-common
   wget -q -O - https://dl.k6.io/key.gpg | sudo apt-key add -
   echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
   sudo apt update
   sudo apt install k6
   ```

2. **Verify Installation:**
   ```sh
   k6 version
   ```

### Windows
1. **Install K6 using Chocolatey:**
   - Open PowerShell as Administrator and run:
   ```powershell
   choco install k6
   ```

2. **Verify Installation:**
   ```powershell
   k6 version
   ```

---

## Running a Test

1. Place your test script (e.g., `loadtest.js`) in your working directory.
2. Run the test:
   ```sh
   k6 run loadtest.js
   ```
   
   - For Windows, use Command Prompt or PowerShell:
     ```powershell
     k6 run loadtest.js
     ```

3. View the results in the terminal. K6 will display metrics such as requests, response times, and errors.

---

## Advanced Usage
- To run with custom options:
  ```sh
  k6 run --vus 10 --duration 30s loadtest.js
  ```
  - `--vus`: Number of virtual users
  - `--duration`: Test duration

- To output results to a file:
  ```sh
  k6 run loadtest.js --out json=summary.json
  ```

---

## Useful Links
- [K6 Documentation](https://k6.io/docs/)
- [K6 Scripting Guide](https://k6.io/docs/using-k6/javascript-api/)

---

## Troubleshooting
- If you encounter issues, ensure K6 is in your system PATH.
- For Linux, you may need to restart your terminal after installation.
- For Windows, run PowerShell/Command Prompt as Administrator for installation.

---

## Example Test Command
```sh
k6 run loadtest.js
```

---

## License
This project uses K6, which is open-source under the AGPL-3.0 license.
