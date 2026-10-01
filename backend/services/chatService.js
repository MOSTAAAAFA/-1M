// AI chat service for the store's assistant.
// Reuses the SAME provider the existing home-page chat already uses (Groq,
// openai/gpt-oss-120b) — NOT Gemini. Adds OpenAI-style function calling so the
// assistant can answer real data questions and execute real navigation actions.
// Returns { text, actions }.

const Order = require("../models/Order");
const User = require("../models/User");

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-120b";
const MAX_ROUNDS = 4;

function startOfDay(dateStr) {
  const d = dateStr ? new Date(`${dateStr}T00:00:00`) : new Date();
  if (isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

function fmtLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ── Real data handlers (real DB queries, never fabricated) ──────────────────
async function get_daily_report({ date } = {}) {
  const start = startOfDay(date);
  if (!start) return { error: "invalid_date" };
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const agg = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lt: end } } },
    { $group: { _id: null, revenue: { $sum: "$total" }, orders: { $sum: 1 } } },
  ]);

  const users = await User.countDocuments({ createdAt: { $gte: start, $lt: end } });
  const { revenue = 0, orders = 0 } = agg[0] || {};
  return {
    date: start.toISOString().slice(0, 10),
    revenue,
    orders,
    users,
    currency: "USD",
  };
}

async function get_revenue({ date } = {}) {
  const start = startOfDay(date);
  if (!start) return { error: "invalid_date" };
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const agg = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lt: end } } },
    { $group: { _id: null, revenue: { $sum: "$total" } } },
  ]);
  return { date: start.toISOString().slice(0, 10), revenue: (agg[0] || {}).revenue || 0, currency: "USD" };
}

async function get_orders_count({ date } = {}) {
  const start = startOfDay(date);
  if (!start) return { error: "invalid_date" };
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { date: start.toISOString().slice(0, 10), orders: await Order.countDocuments({ createdAt: { $gte: start, $lt: end } }) };
}

async function get_user_count({ date } = {}) {
  if (date) {
    const start = startOfDay(date);
    if (!start) return { error: "invalid_date" };
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { date, users: await User.countDocuments({ createdAt: { $gte: start, $lt: end } }) };
  }
  return { users: await User.countDocuments() };
}

// ── Real navigation actions (existing routes only) ──────────────────────────
const ADMIN_PAGES = {
  dashboard: { path: "/admin/dashboard", label: "الإحصائيات" },
  users: { path: "/admin/users", label: "صفحة المستخدمين" },
  orders: { path: "/admin/orders", label: "صفحة الأوردرات" },
  cars: { path: "/admin/cars", label: "صفحة السيارات" },
  settings: { path: "/admin/settings", label: "الإعدادات" },
};

function open_admin_page({ page } = {}) {
  const target = ADMIN_PAGES[page];
  if (!target) return { error: "unknown_page", valid: Object.keys(ADMIN_PAGES) };
  return { ok: true, path: target.path, label: target.label };
}

const HANDLERS = { get_daily_report, get_revenue, get_orders_count, get_user_count, open_admin_page };

// ── Groq tool schema (OpenAI-compatible) ────────────────────────────────────
const TOOLS = [
  {
    type: "function",
    function: {
      name: "get_daily_report",
      description: "يرجع تقرير يوم كامل: الإيراد (مجموع الأوردرات) وعدد الأوردرات وعدد المستخدمين الجدد في اليوم المحدد. لو مافيش تاريخ، يرجع النهاردة. استخدمها عند سؤال عن تقرير/أرباح/مبيعات اليوم أو بشكل عام.",
      parameters: {
        type: "object",
        properties: { date: { type: ["string", "null"], description: "YYYY-MM-DD (اختياري)" } },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_revenue",
      description: "يرجع إيرادات (مجموع قيم الأوردرات) في يوم محدد أو النهاردة.",
      parameters: {
        type: "object",
        properties: { date: { type: ["string", "null"], description: "YYYY-MM-DD (اختياري)" } },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_orders_count",
      description: "يرجع عدد الأوردرات في يوم محدد أو النهاردة.",
      parameters: {
        type: "object",
        properties: { date: { type: ["string", "null"], description: "YYYY-MM-DD (اختياري)" } },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_user_count",
      description: "يرجع عدد المستخدمين المسجلين. لو محدد تاريخ، بيرجع عدد اللي اتسجلوا في اليوم ده.",
      parameters: {
        type: "object",
        properties: { date: { type: ["string", "null"], description: "YYYY-MM-DD (اختياري)" } },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "open_admin_page",
      description: "يفتح صفحة جوه لوحة التحكم. الصفحات المتاحة: dashboard، users، orders، cars، settings. استخدمها لما المستخدم يطلب فتح صفحة زي 'افتح صفحة المستخدمين' أو 'روحني للإحصائيات'.",
      parameters: {
        type: "object",
        properties: {
          page: { type: "string", enum: ["dashboard", "users", "orders", "cars", "settings"], description: "اسم الصفحة" },
        },
        required: ["page"],
        additionalProperties: false,
      },
    },
  },
];

// Tool guidance appended to whatever system prompt the client sent.
const TOOL_SYSTEM = `
You also have access to real store tools via function calling.

Rules:
- When the user asks for REAL numbers (today's/yesterday's revenue, orders, users, "عملنا كام أرباح", "اعرض تقرير النهاردة") ALWAYS call the matching data tool, then read the exact number from the result and state it. NEVER invent a number.
- When the user asks to OPEN a page ("افتح صفحة المستخدمين", "روحني للإحصائيات", "افتح الأوردرات") call open_admin_page and confirm what you opened in your reply.
- Reply in the SAME language the user wrote in. Keep replies to 1-2 short sentences (they are spoken aloud).
- No markdown, no lists, no bullet points.`;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callGroq(body) {
  let lastErr;
  if (process.env.DEBUG_CHAT) console.log("[DBG body]", JSON.stringify(body));
  // Retry transient 429/503/5xx with backoff, like the prior Gemini path.
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) return data;
    lastErr = Object.assign(new Error(data?.error?.message || `Groq ${res.status}`), {
      status: res.status,
      data,
    });
    if (res.status === 429 || res.status >= 500) {
      await sleep(1500 * (attempt + 1));
      continue;
    }
    break;
  }
  throw lastErr;
}

// Anthropic-ish {role:'user'|'assistant', content} → OpenAI format
function toGroqMessages(refined) {
  return refined.map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content,
  }));
}

/**
 * Main entry: same shape the existing /api/chat endpoint already accepted.
 * messages = [{role, content}] (caller maps its own roles). system = prompt.
 * Returns { text, actions: [{type:'navigate', path}] }.
 */
async function chatWithTools({ messages, system }) {
  const groqMessages = [
    { role: "system", content: TOOL_SYSTEM },
    { role: "system", content: system || "" },
    ...toGroqMessages(messages || []),
  ];

  const actions = [];

  for (let round = 0; round < MAX_ROUNDS; round++) {
    const body = {
      model: GROQ_MODEL,
      messages: groqMessages,
      max_tokens: 1000,
      tools: TOOLS,
      tool_choice: "auto",
    };

    const data = await callGroq(body);
    const choice = data?.choices?.[0];
    const msg = choice?.message || {};

    if (process.env.DEBUG_CHAT) {
      console.log("[DBG round]", round, "tool_calls:", JSON.stringify(msg.tool_calls || null), "content:", JSON.stringify(msg.content || null));
    }

    const toolCalls = msg.tool_calls || [];
    if (!toolCalls.length) {
      const text = (msg.content || "").trim();
      if (!text) throw Object.assign(new Error("Groq returned no response"), { status: 500 });
      return { text, actions };
    }

    // Feed the assistant's tool-call turn back to the API
    groqMessages.push({ role: "assistant", content: msg.content || "", tool_calls: toolCalls });

    for (const call of toolCalls) {
      const fn = call.function;
      const handler = HANDLERS[fn?.name];
      let result;
      if (!handler) {
        result = { error: "unknown_tool" };
      } else {
        try {
          result = await handler(JSON.parse(fn.arguments || "{}"));
        } catch (e) {
          result = { error: e.message || "tool_error" };
        }
      }

      if (process.env.DEBUG_CHAT) {
        console.log("[DBG tool]", fn.name, JSON.stringify(result));
      }

      if (fn.name === "open_admin_page" && result?.ok) {
        actions.push({ type: "navigate", path: result.path });
      }

      groqMessages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(result),
      });
    }
  }

  throw Object.assign(new Error("Assistant tool loop exceeded max rounds"), { status: 500 });
}

module.exports = { chatWithTools, TOOLS, HANDLERS };