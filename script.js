const API_KEY = "e0f1807aec833cb378737ac30e903989";
const API_URL = "https://api.marketstack.com/v1/eod";
let currentPage = 1;
let symbol = "";

// Fetch stock data
async function fetchStockData(page) {
    const errorElement = document.getElementById("error");
    errorElement.style.display = "none"; // Hide error on each fetch

    try {
        const response = await fetch(`${API_URL}?access_key=${API_KEY}&symbols=${symbol}&limit=5&offset=${(page - 1) * 5}`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.error) {
            throw new Error("Invalid symbol or API error.");
        }

        renderTable(data.data);
        updatePagination(data.data.length);

    } catch (error) {
        showError(error.message);
    }
}

// Render data into the table
function renderTable(data) {
    const tableBody = document.getElementById("stockBody");
    tableBody.innerHTML = "";

    data.forEach(stock => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${stock.symbol}</td>
            <td>${new Date(stock.date).toLocaleDateString()}</td>
            <td>${stock.open}</td>
            <td>${stock.close}</td>
            <td>${stock.high}</td>
            <td>${stock.low}</td>
            <td>${stock.volume}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Update pagination button states
function updatePagination(dataLength) {
    document.getElementById("prevBtn").disabled = currentPage <= 1;
    document.getElementById("nextBtn").disabled = dataLength < 5;
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById("error");
    errorElement.textContent = message;
    errorElement.style.display = "block";
}

// Event Listeners
document.getElementById("searchButton").addEventListener("click", () => {
    symbol = document.getElementById("search").value.trim().toUpperCase();
    if (symbol) {
        currentPage = 1;
        fetchStockData(currentPage);
    }
});

document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        fetchStockData(currentPage);
    }
});

document.getElementById("nextBtn").addEventListener("click", () => {
    currentPage++;
    fetchStockData(currentPage);
});
