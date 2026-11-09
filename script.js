// =================================
// 1. الاتصال بـ Supabase
// =================================

const SUPABASE_URL = "https://nlyyyrygctsjnkseohbz.supabase.co";
const SUPABASE_KEY = "sb_publishable_hTGBLLu0-tvDWQffvu-hKw_BFMDM7DG";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// =================================
// 2. عناصر الصفحة
// =================================

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const authSection = document.getElementById("auth-section");
const tasksSection = document.getElementById("tasks-section");

const authMessage = document.getElementById("auth-message");
const taskTitle = document.getElementById("task-title");
const tasksList = document.getElementById("tasks-list");

let currentUser = null;

// =================================
// 3. رسائل المستخدم
// =================================

function showMessage(message, isError = false) {
  authMessage.textContent = message;
  authMessage.style.color = isError ? "#dc2626" : "#059669";
}

// =================================
// 4. إظهار الشاشة المناسبة
// =================================

function showScreen(isLoggedIn) {
  authSection.hidden = isLoggedIn;
  tasksSection.hidden = !isLoggedIn;
}

// =================================
// 5. إنشاء حساب
// =================================

document.getElementById("signup-btn").addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage("اكتب البريد الإلكتروني وكلمة المرور", true);
    return;
  }

  if (password.length < 6) {
    showMessage("كلمة المرور يجب أن تكون 6 أحرف على الأقل", true);
    return;
  }

  const { data, error } = await db.auth.signUp({
    email,
    password
  });

  if (error) {
    showMessage(error.message, true);
    return;
  }

  if (data.session) {
    showMessage("تم إنشاء الحساب بنجاح");
  } else {
    showMessage("تم إنشاء الحساب. راجع بريدك لتأكيد التسجيل، ثم سجل الدخول.");
  }
});

// =================================
// 6. تسجيل الدخول
// =================================

document.getElementById("login-btn").addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage("اكتب البريد الإلكتروني وكلمة المرور", true);
    return;
  }

  const { error } = await db.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    showMessage(error.message, true);
  }
});

// =================================
// 7. تسجيل الخروج
// =================================

document.getElementById("logout-btn").addEventListener("click", async () => {
  const { error } = await db.auth.signOut();

  if (error) {
    showMessage(error.message, true);
  }
});

// =================================
// 8. تحميل المهام
// =================================

async function loadTasks() {
  if (!currentUser) return;

  tasksList.replaceChildren();

  const { data, error } = await db
    .from("tasks")
    .select("id, title, is_completed")
    .order("created_at", { ascending: false });

  if (error) {
    tasksList.textContent = "تعذر تحميل المهام: " + error.message;
    return;
  }

  if (!data.length) {
    tasksList.textContent = "لا توجد مهام حتى الآن. أضف أول مهمة!";
    return;
  }

  data.forEach(task => renderTask(task));
}

// =================================
// 9. عرض المهمة
// =================================

function renderTask(task) {
  const item = document.createElement("div");
  item.className = "task";

  if (task.is_completed) {
    item.classList.add("completed");
  }

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.is_completed;

  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = task.title;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.textContent = "حذف";

  checkbox.addEventListener("change", async () => {
    const { error } = await db
      .from("tasks")
      .update({ is_completed: checkbox.checked })
      .eq("id", task.id);

    if (error) {
      alert("تعذر تعديل المهمة: " + error.message);
    }

    await loadTasks();
  });

  deleteButton.addEventListener("click", async () => {
    if (!confirm("هل تريد حذف هذه المهمة؟")) return;

    const { error } = await db
      .from("tasks")
      .delete()
      .eq("id", task.id);

    if (error) {
      alert("تعذر حذف المهمة: " + error.message);
      return;
    }

    await loadTasks();
  });

  item.append(checkbox, title, deleteButton);
  tasksList.appendChild(item);
}

// =================================
// 10. إضافة مهمة
// =================================

document.getElementById("add-task-btn").addEventListener("click", addTask);

taskTitle.addEventListener("keydown", event => {
  if (event.key === "Enter") addTask();
});

async function addTask() {
  const title = taskTitle.value.trim();

  if (!title) {
    alert("اكتب اسم المهمة أولاً");
    return;
  }

  if (!currentUser) return;

  const { error } = await db
    .from("tasks")
    .insert({
      title,
      is_completed: false,
      user_id: currentUser.id
    });

  if (error) {
    alert("تعذر حفظ المهمة: " + error.message);
    return;
  }

  taskTitle.value = "";
  await loadTasks();
}

// =================================
// 11. متابعة حالة الحساب
// =================================

db.auth.onAuthStateChange((event, session) => {
  currentUser = session?.user || null;

  showScreen(!!currentUser);

  if (currentUser) {
    // نؤجل تحميل المهام حتى ينتهي حدث المصادقة
    Promise.resolve().then(() => loadTasks());
  } else {
    tasksList.replaceChildren();
  }
});

// =================================
// 12. التحقق من الجلسة عند فتح الموقع
// =================================

async function initializeApp() {
  const { data, error } = await db.auth.getSession();

  if (error) {
    showMessage("تعذر التحقق من الحساب: " + error.message, true);
    return;
  }

  currentUser = data.session?.user || null;

  showScreen(!!currentUser);

  if (currentUser) {
    await loadTasks();
  }
}

initializeApp();
