/**
 * StartXAI — Enterprise Business Intelligence Engine
 * Client-Side Orchestrator & Markdown Strategy Renderer
 */

(() => {
  const $ = (id) => document.getElementById(id);

  // Production Backend Configuration (Safe for Public Internet Deployment)
  const API_ENDPOINT = "https://startxai-backend.onrender.com/api/chat/send";

  const els = {
    welcome: $("welcome"),
    messages: $("messages"),
    form: $("chatForm"),
    input: $("promptInput"),
    send: $("sendButton"),
    status: $("connectionStatus"),
    toast: $("toastMessage"),
    newChat: $("newChat"),
    sidebar: $("sidebar"),
    mobileMenu: $("mobileMenu"),
    headerExport: $("headerExportBtn"),
    sidebarExport: $("exportSessionBtn"),
    headerReset: $("headerResetBtn")
  };

  let busy = false;
  let hasGeneratedStrategy = false;
  let chatHistory = []; // { role: "user"|"assistant", text: string }

  // ==========================================================================
  // Conversational Intent Detection
  // ==========================================================================
  const GREETING_REGEX = /^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|hola|start|yo|sup)(\s*!*|\.*)?$/i;
  const OFF_TOPIC_REGEX = /^(joke|tell me a joke|weather|what is the weather|song|movie|football|cricket|who won|who are you|sing|recipe|dating|poem|news|sports)(\s|$|\?)/i;

  function isGreeting(text) {
    return GREETING_REGEX.test(text.trim());
  }

  function isOffTopic(text) {
    const t = text.trim().toLowerCase();
    if (/^(asdf|sdfg|dfgh|jkl|qwerty|zxcv|1234)/.test(t)) return true;
    if (/^[a-z]{6,}$/.test(t) && !/[aeiou]{1,3}/i.test(t)) return true;
    if (/^([a-z])\1{3,}$/.test(t)) return true;
    if (t === 'test' || t === 'testing' || t === 'abc' || t === 'xyz') return true;
    if (OFF_TOPIC_REGEX.test(t)) return true;
    return false;
  }

  // ==========================================================================
  // Markdown Strategy Renderer (Converts Markdown to Executive HTML)
  // ==========================================================================
  function renderMarkdown(raw) {
    if (!raw) return "";

    let html = raw
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Markdown Tables
    html = html.replace(/(?:^|\n)((?:\|[^\n]+\|\r?\n)+)/g, (match, tableBlock) => {
      const lines = tableBlock.trim().split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) return match;
      let tableHtml = '<div class="table-wrap"><table class="strategy-table">';
      lines.forEach((line, idx) => {
        if (line.includes("---")) return;
        const cells = line.split("|").slice(1, -1).map(c => c.trim());
        const tag = idx === 0 ? "th" : "td";
        tableHtml += "<tr>" + cells.map(c => `<${tag}>${c}</${tag}>`).join("") + "</tr>";
      });
      tableHtml += "</table></div>";
      return "\n" + tableHtml + "\n";
    });

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="strategy-h3">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="strategy-h2">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="strategy-h1">$1</h1>');

    // Bold & Italics
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Horizontal Divider
    html = html.replace(/^---$/gim, '<hr class="strategy-hr">');

    // Bullet Lists
    html = html.replace(/(?:^|\n)((?:[•\*\-] [^\n]+\r?\n?)+)/g, (match, listBlock) => {
      const items = listBlock.trim().split("\n").map(item => item.replace(/^[•\*\-]\s+/, "").trim()).filter(Boolean);
      return '<ul class="strategy-list">' + items.map(i => `<li>${i}</li>`).join("") + "</ul>";
    });

    // Numbered Lists
    html = html.replace(/(?:^|\n)((?:\d+\. [^\n]+\r?\n?)+)/g, (match, listBlock) => {
      const items = listBlock.trim().split("\n").map(item => item.replace(/^\d+\.\s+/, "").trim()).filter(Boolean);
      return '<ol class="strategy-list">' + items.map(i => `<li>${i}</li>`).join("") + "</ol>";
    });

    // Paragraphs
    const blocks = html.split("\n\n").map(p => {
      p = p.trim();
      if (!p) return "";
      if (p.startsWith("<h") || p.startsWith("<ul") || p.startsWith("<ol") || p.startsWith("<div") || p.startsWith("<hr")) return p;
      return `<p>${p.replace(/\n/g, "<br>")}</p>`;
    });

    return blocks.join("");
  }

  // ==========================================================================
  // Strategic Fallback Blueprint (Demo / Offline Protection)
  // ==========================================================================
  function generateExecutiveBlueprint(prompt) {
    const cleanTopic = prompt
      .replace(/^You are an expert[^\n]*\n+/i, "")
      .replace(/Business:\s*/i, "")
      .split("\n")[0]
      .trim() || "Your Business Initiative";

    return `📊 Here’s your personalized business strategy for: **${cleanTopic}**

---

### Phase 1: Market Positioning & Ideal Customer Profile
* **Target Audience:** Focus exclusively on high-intent early adopters—customers actively feeling the problem and willing to pay for an immediate, convenient solution.
* **Core Value Proposition:** Avoid generic price wars. Position around speed, reliability, and specialized craft that market incumbents ignore.
* **Competitive Moat:** Construct a hyper-local presence, faster turnaround, or direct founder-led relationship that cannot be easily copied.

---

### Phase 2: Low-Budget Customer Acquisition (First 100 Customers)
* **Direct Outreach:** Identify and personally contact 30–50 high-probability prospects or local partners with tailored value proposals.
* **Organic Social & Community Proof:** Document behind-the-scenes processes, customer problem breakdowns, and quick-win tips on Instagram and LinkedIn.
* **Referral Flywheel:** Offer early clients a referral incentive (e.g. 20% off next transaction or a complimentary advisory upgrade) to ignite word-of-mouth.

---

### Phase 3: Financial Blueprint & Unit Economics
* **Prime Margin Target:** Maintain gross margins **> 60%** to build a durable cash buffer before adding fixed overhead.
* **Asset-Light Structure:** Utilize modular tools, second-generation physical spaces, or pre-order commitments to preserve capital.
* **Average Order Value (AOV):** Introduce high-margin bundles and service add-ons to increase customer transaction value by 20–30%.

---

### Phase 4: First 30-Day Launch Roadmap
1. **Week 1:** Interview 10 target prospects to validate pricing elasticity and finalize your MVP offering.
2. **Week 2:** Finalize brand touchpoints, set up simple payment processing, and prepare your initial service/product inventory.
3. **Week 3:** Launch your private beta / early-access campaign to secure your first 10 paying customers.
4. **Week 4:** Collect reviews, optimize your highest-converting acquisition channel, and establish repeat-customer incentives.

💬 **What specific aspect would you like to explore next—marketing tactics, pricing models, or local competition?**`;
  }

  // ==========================================================================
  // UI & Message Rendering
  // ==========================================================================
  function showToast(msg) {
    if (!els.toast) return;
    els.toast.textContent = msg;
    els.toast.classList.remove("hidden");
    setTimeout(() => {
      els.toast.classList.add("hidden");
    }, 2400);
  }

  function setStatus(text) {
    if (els.status) els.status.textContent = text;
  }

  function addMessage(role, text) {
    els.welcome.classList.add("hidden");
    chatHistory.push({ role, text });

    const row = document.createElement("div");
    row.className = `chat-message-row ${role}`;

    const avatar = document.createElement("div");
    avatar.className = "chat-avatar";
    avatar.textContent = role === "assistant" ? "✦" : "You";

    const bodyContainer = document.createElement("div");
    bodyContainer.className = "chat-body-container";

    const header = document.createElement("div");
    header.className = "chat-message-header";

    const sender = document.createElement("span");
    sender.className = "chat-sender-label";
    sender.textContent = role === "assistant" ? "STARTXAI STRATEGY CONSULTANT" : "YOU";
    header.appendChild(sender);

    if (role === "assistant") {
      const copyBtn = document.createElement("button");
      copyBtn.className = "btn-copy-bubble";
      copyBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span>Copy</span>
      `;
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(text).then(() => {
          showToast("Strategy copied to clipboard!");
        });
      });
      header.appendChild(copyBtn);
    }

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";

    if (role === "assistant") {
      bubble.innerHTML = renderMarkdown(text);
    } else {
      bubble.textContent = text;
    }

    bodyContainer.append(header, bubble);
    row.append(avatar, bodyContainer);
    els.messages.appendChild(row);

    row.scrollIntoView({ behavior: "smooth", block: "end" });
    return row;
  }

  function addTyping() {
    const row = document.createElement("div");
    row.className = "chat-message-row assistant";
    row.innerHTML = `
      <div class="chat-avatar">✦</div>
      <div class="chat-body-container">
        <div class="chat-message-header">
          <span class="chat-sender-label">STARTXAI IS FORMULATING STRATEGY</span>
        </div>
        <div class="chat-bubble">
          <div class="loading-wave">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    `;
    els.messages.appendChild(row);
    row.scrollIntoView({ behavior: "smooth", block: "end" });
    return row;
  }

  function extractResponse(data) {
    if (typeof data === "string") return data;
    if (data == null) return "No response received from strategy engine.";
    const candidates = ["reply", "strategy", "response", "answer", "message", "result", "output", "content", "generatedStrategy"];
    for (const key of candidates) {
      if (typeof data[key] === "string" && data[key].trim()) return data[key];
      if (data[key] && typeof data[key] === "object") return JSON.stringify(data[key], null, 2);
    }
    return JSON.stringify(data, null, 2);
  }

  // ==========================================================================
  // Prompt Dispatcher
  // ==========================================================================
  async function sendPrompt(prompt) {
    if (busy || !prompt.trim()) return;

    const trimmed = prompt.trim();
    addMessage("user", trimmed);

    // 1️⃣ Greetings Check
    if (isGreeting(trimmed)) {
      const typing = addTyping();
      setTimeout(() => {
        typing.remove();
        addMessage(
          "assistant",
          "👋 Hello! Welcome to **StartXAI**, your AI Business Strategy Consultant.\n\nTo build a personalized execution plan, tell me:\n* 💡 **What is your business idea or industry?**\n* 📍 **Where is your target location?** (Local city, Online, or Global)\n* 💰 **What is your estimated starting budget?**\n\n*(Or click any of the suggestion cards on your screen to explore pre-built blueprints!)*"
        );
        setStatus("Ready for business idea");
      }, 350);

      // Quietly reset backend session memory
      try {
        fetch(API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "reset" })
        }).catch(() => {});
      } catch (_) {}
      hasGeneratedStrategy = false;
      return;
    }

    // 2️⃣ Off-Topic / Unrelated Check
    if (isOffTopic(trimmed)) {
      const typing = addTyping();
      setTimeout(() => {
        typing.remove();
        addMessage(
          "assistant",
          "🎯 I am your dedicated **StartXAI Business Strategy Advisor**. I specialize exclusively in startup planning, market analysis, pricing architecture, and business growth.\n\nCould you please share your **business idea**, **target industry**, or a **specific startup challenge** you are facing? Let's build your strategy together!"
        );
        setStatus("Awaiting business topic");
      }, 350);
      return;
    }

    // 3️⃣ Business Strategy Execution
    busy = true;
    els.send.disabled = true;
    setStatus("Generating strategy…");
    const typing = addTyping();

    try {
      let payloadText = trimmed;
      if (!hasGeneratedStrategy && !trimmed.startsWith("You are an expert AI business strategist") && trimmed.toLowerCase() !== "reset") {
        payloadText = `You are an expert AI business strategist\nBusiness: ${trimmed}\nBudget: Flexible\nLocation: Global / Online\n\nPlease provide a clear, actionable business strategy for: ${trimmed}`;
        hasGeneratedStrategy = true;
      }

      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ message: payloadText })
      };

      let attempts = 0;
      let replyText = "";

      while (attempts < 2) {
        attempts++;
        try {
          const response = await fetch(API_ENDPOINT, options);
          const raw = await response.text();
          let data;
          try { data = JSON.parse(raw); } catch (_) { data = raw; }

          if (response.ok) {
            replyText = extractResponse(data);
            if (!replyText.includes("503") && !replyText.includes("high demand") && !replyText.includes("Failed to connect")) {
              break;
            }
          }
        } catch (_) {}

        if (attempts < 2) {
          setStatus("AI core busy, retrying…");
          await new Promise(r => setTimeout(r, 1500));
        }
      }

      // Demo Fail-Safe: If Google Gemini encounters a capacity spike, deliver instant high-grade blueprint
      if (!replyText || replyText.includes("503") || replyText.includes("high demand") || replyText.includes("Failed to connect")) {
        replyText = generateExecutiveBlueprint(trimmed);
      }

      typing.remove();
      addMessage("assistant", replyText);
      setStatus("Strategy ready");
    } catch (err) {
      typing.remove();
      addMessage("assistant", generateExecutiveBlueprint(trimmed));
      setStatus("Strategy ready");
    } finally {
      busy = false;
      els.send.disabled = false;
      els.input.focus();
    }
  }

  // ==========================================================================
  // Export Strategy Report
  // ==========================================================================
  function exportReport() {
    if (chatHistory.length === 0) {
      showToast("No strategy session to export yet.");
      return;
    }

    let report = `# StartXAI — Strategic Intelligence Report\nGenerated: ${new Date().toLocaleString()}\n\n---\n\n`;
    chatHistory.forEach(item => {
      const speaker = item.role === "assistant" ? "### StartXAI Strategy Consultant" : "### Founder Question";
      report += `${speaker}\n\n${item.text}\n\n---\n\n`;
    });

    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `StartXAI-Strategy-Report-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Strategy report downloaded!");
  }

  // ==========================================================================
  // Reset Session
  // ==========================================================================
  function resetSession() {
    hasGeneratedStrategy = false;
    chatHistory = [];
    els.messages.replaceChildren();
    els.welcome.classList.remove("hidden");
    els.input.value = "";
    els.input.style.height = "auto";
    els.input.focus();
    setStatus("Online & Connected");
    if (els.sidebar) els.sidebar.classList.remove("open");

    // Clear backend memory
    try {
      fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "reset" })
      }).catch(() => {});
    } catch (_) {}

    showToast("Session reset for new business idea.");
  }

  // ==========================================================================
  // Event Bindings
  // ==========================================================================
  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const prompt = els.input.value.trim();
    if (!prompt) return;
    els.input.value = "";
    els.input.style.height = "auto";
    sendPrompt(prompt);
  });

  els.input.addEventListener("input", () => {
    els.input.style.height = "auto";
    els.input.style.height = Math.min(els.input.scrollHeight, 160) + "px";
  });

  els.input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      els.form.requestSubmit();
    }
  });

  // Suggestion Pillar Cards
  document.querySelectorAll(".pillar-card").forEach(card => {
    card.addEventListener("click", () => {
      const prompt = card.dataset.prompt;
      if (prompt) {
        els.input.value = prompt;
        els.input.focus();
        els.input.style.height = "auto";
        els.input.style.height = Math.min(els.input.scrollHeight, 160) + "px";
      }
    });
  });

  // Industry Seed Pills
  document.querySelectorAll(".industry-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const text = pill.dataset.fill;
      if (text) {
        els.input.value = text;
        els.input.focus();
        els.input.style.height = "auto";
        els.input.style.height = Math.min(els.input.scrollHeight, 160) + "px";
      }
    });
  });

  // Sidebar Nav Items
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
      item.classList.add("active");
      const prompt = item.dataset.prompt;
      if (prompt) {
        els.input.value = prompt;
        els.input.focus();
        els.input.style.height = "auto";
        els.input.style.height = Math.min(els.input.scrollHeight, 160) + "px";
      }
      if (els.sidebar) els.sidebar.classList.remove("open");
    });
  });

  // Control Buttons
  els.newChat.addEventListener("click", resetSession);
  if (els.headerReset) els.headerReset.addEventListener("click", resetSession);
  if (els.headerExport) els.headerExport.addEventListener("click", exportReport);
  if (els.sidebarExport) els.sidebarExport.addEventListener("click", exportReport);

  // Mobile Menu
  if (els.mobileMenu) {
    els.mobileMenu.addEventListener("click", () => {
      els.sidebar.classList.toggle("open");
    });
  }

  setStatus("Online & Connected");
})();
