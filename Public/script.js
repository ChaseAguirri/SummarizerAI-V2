document.addEventListener("DOMContentLoaded", () => {
  const textInput = document.getElementById("text-input");
  const summarizeBtn = document.getElementById("summarize-btn");
  const summaryOutput = document.getElementById("summary-output");
  const copyBtn = document.getElementById("copy-btn");
  const historyBtn = document.getElementById("history-btn");
  const historyModal = document.getElementById("history-modal");
  const historyCloseBtn = document.getElementById("history-close-btn");
  const historyList = document.getElementById("history-list");

  let historyData = [];

  
  function getSelectedMode() {
    const selected = document.querySelector('input[name="mode"]:checked');
    return selected ? selected.value : 'best';
  }

  
  function saveToHistory(inputText, summaryText, mode) {
    if (!inputText || !summaryText) return;

    const entry = {
      id: Date.now(),
      input: inputText,
      summary: summaryText,
      mode: mode,
      timestamp: new Date().toLocaleString()
    };

    historyData.unshift(entry);

    if (historyData.length > 20) {
      historyData.pop();
    }

    renderHistory();
  }

  
  function renderHistory() {
    historyList.innerHTML = '';
    if (historyData.length === 0) {
      historyList.innerHTML = '<p>No history yet.</p>';
      return;
    }

    historyData.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'history-item';

      
      const titleEl = document.createElement('div');
      titleEl.className = 'history-title';
      titleEl.textContent = `[${item.mode}] ${item.timestamp}`;
      titleEl.tabIndex = 0;
      titleEl.setAttribute('role', 'button');
      titleEl.setAttribute('aria-expanded', 'false');

     
      const detailsEl = document.createElement('div');
      detailsEl.className = 'history-details';

      
      const inputBlock = document.createElement('pre');
      inputBlock.className = 'history-content-block';
      inputBlock.textContent = `Input:\n${item.input}`;

      
      const summaryBlock = document.createElement('pre');
      summaryBlock.className = 'history-content-block';
      summaryBlock.textContent = `Summary:\n${item.summary}`;

      
      const copySummaryBtn = document.createElement('button');
      copySummaryBtn.className = 'history-copy-btn';
      copySummaryBtn.textContent = 'Copy Summary';
      copySummaryBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(item.summary).then(() => {
          copySummaryBtn.textContent = 'Copied!';
          setTimeout(() => (copySummaryBtn.textContent = 'Copy Summary'), 1500);
        });
      });

      detailsEl.appendChild(inputBlock);
      detailsEl.appendChild(summaryBlock);
      detailsEl.appendChild(copySummaryBtn);

      
      titleEl.addEventListener('click', () => {
        const isOpen = detailsEl.classList.toggle('open');
        titleEl.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
      titleEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          titleEl.click();
        }
      });

      itemEl.appendChild(titleEl);
      itemEl.appendChild(detailsEl);
      historyList.appendChild(itemEl);
    });
  }

  
  summarizeBtn.addEventListener("click", async () => {
    const text = textInput.value.trim();
    const mode = getSelectedMode();

    if (!text) {
      alert("Please enter or drop some text first.");
      return;
    }

    summarizeBtn.disabled = true;
    summarizeBtn.textContent = "Summarizing...";

    try {
      const response = await fetch("http://localhost:3000/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode }),
      });

      const data = await response.json();

      if (data.error) {
        summaryOutput.textContent = "Error: " + data.error;
      } else {
        summaryOutput.textContent = data.summary;
        saveToHistory(text, data.summary, mode);
      }
    } catch (err) {
      summaryOutput.textContent = "Failed to summarize. Server error.";
      console.error(err);
    }

    summarizeBtn.disabled = false;
    summarizeBtn.textContent = "Summarize";
  });

const clearBtn = document.getElementById("clear-btn");
clearBtn.addEventListener("click", () => {
  summaryOutput.textContent = "";
});


  copyBtn.addEventListener("click", () => {
    const summary = summaryOutput.textContent;
    if (!summary) return;

    navigator.clipboard.writeText(summary).then(() => {
      copyBtn.textContent = "✅";
      setTimeout(() => (copyBtn.textContent = "📋"), 1200);
    });
  });

  
  historyBtn.addEventListener("click", () => {
    renderHistory();
    historyModal.style.display = "flex";
  });

  
  historyCloseBtn.addEventListener("click", () => {
    historyModal.style.display = "none";
  });

  
  historyModal.addEventListener("click", (e) => {
    if (e.target === historyModal) {
      historyModal.style.display = "none";
    }
  });

 
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && historyModal.style.display === "flex") {
      historyModal.style.display = "none";
    }
  });
});
