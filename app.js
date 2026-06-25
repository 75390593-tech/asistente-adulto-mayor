const app = document.getElementById("app");

const APP_NAME = "CuidApp Mayor";
const APP_SUBTITLE = "Asistente virtual para adultos mayores";

const TEAM_MEMBERS = [
  "EVELIN YADIRA SEGURA ROSALES",
  "GIANMARCO KEVIN MAMANI CHAMPI",
  "JHONN WAGNER PINEDO MARCELO",
  "JOAO IVAN VILLAR QUISPE",
  "JUNIOR ABRAHAN LAURENTE ALARCON",
  "LEONIDAS VLADIMIR ALARCON RAMIREZ",
  "VICTOR FERNANDO MASIAS BACA"
];

let state = {
  currentUser: null,
  currentRole: "adulto",
  screen: "dashboard",
  health: [],
  medicines: [],
  reminders: [],
  appointments: [],
  contacts: [],
  alerts: []
};

function loadData() {
  const saved = localStorage.getItem("cuidAppMayorData");

  if (saved) {
    state = JSON.parse(saved);
  }
}

function saveData() {
  localStorage.setItem("cuidAppMayorData", JSON.stringify(state));
}

function resetDemoData() {
  const confirmReset = confirm("¿Desea limpiar los datos registrados en esta demostración?");

  if (!confirmReset) {
    return;
  }

  const currentUser = state.currentUser;
  const currentRole = state.currentRole;

  state = {
    currentUser: currentUser,
    currentRole: currentRole,
    screen: "dashboard",
    health: [],
    medicines: [],
    reminders: [],
    appointments: [],
    contacts: [],
    alerts: []
  };

  saveData();
  alert("Los datos de la demostración fueron limpiados correctamente.");
  renderApp();
}

function loadDemoData() {
  const confirmLoad = confirm("¿Desea cargar datos de ejemplo para la demostración?");

  if (!confirmLoad) {
    return;
  }

  state.health = [
    {
      bloodType: "O+",
      weight: "68",
      height: "165",
      allergies: "Penicilina",
      conditions: "Hipertensión controlada",
      notes: "Requiere seguimiento de presión arterial."
    }
  ];

  state.medicines = [
    {
      name: "Losartán",
      dose: "50 mg",
      time: "08:00",
      frequency: "Diario"
    },
    {
      name: "Metformina",
      dose: "850 mg",
      time: "20:00",
      frequency: "Diario"
    }
  ];

  state.reminders = [
    {
      medicine: "Losartán",
      date: "2026-07-15",
      time: "08:00",
      frequency: "Diario",
      status: "Pendiente"
    },
    {
      medicine: "Metformina",
      date: "2026-07-15",
      time: "20:00",
      frequency: "Diario",
      status: "Pendiente"
    }
  ];

  state.appointments = [
    {
      date: "2026-07-18",
      time: "10:30",
      specialty: "Cardiología",
      notes: "Llevar últimos resultados de presión arterial."
    },
    {
      date: "2026-07-25",
      time: "09:00",
      specialty: "Medicina general",
      notes: "Control mensual de tratamiento."
    }
  ];

  state.contacts = [
    {
      name: "María López",
      phone: "987654321",
      relation: "Hija",
      method: "WhatsApp"
    },
    {
      name: "Carlos Ramírez",
      phone: "912345678",
      relation: "Cuidador",
      method: "Llamada"
    }
  ];

  state.alerts = [
    {
      date: new Date().toLocaleString(),
      status: "Demo",
      detail: "Alerta de ejemplo cargada para presentación académica."
    }
  ];

  state.screen = "dashboard";
  saveData();
  alert("Datos de ejemplo cargados correctamente.");
  renderApp();
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showMessage(type, text) {
  return `<div class="message ${type}">${escapeHTML(text)}</div>`;
}

function renderLogin() {
  app.innerHTML = `
    <section class="login-page">
      <div class="login-card">
        <div class="logo-box">
          <div class="logo-icon">💙</div>
          <h1>${APP_NAME}</h1>
          <p>${APP_SUBTITLE} con monitoreo básico de salud, recordatorios médicos y alertas de emergencia.</p>
        </div>

        <form id="loginForm">
          <div class="form-group">
            <label>Correo electrónico</label>
            <input type="email" id="email" required />
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" id="password" required />
          </div>

          <button class="btn btn-primary btn-full" type="submit">Iniciar sesión</button>
        </form>

        <div class="login-links">
          <button onclick="renderRegister()">Crear una cuenta nueva</button>
        </div>

        <div class="demo-box">
          <strong>Credenciales de prueba:</strong><br>
          Adulto mayor: adulto.mayor@test.com / 123456<br>
          Familiar: familiar.test@test.com / 123456
        </div>
      </div>
    </section>
  `;

  document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Debe ingresar correo y contraseña.");
      return;
    }

    state.currentUser = email;
    state.currentRole = email.includes("familiar") ? "cuidador" : "adulto";
    state.screen = "dashboard";
    saveData();
    renderApp();
  });
}

function renderRegister() {
  app.innerHTML = `
    <section class="login-page">
      <div class="login-card">
        <div class="logo-box">
          <div class="logo-icon">📝</div>
          <h1>Registro en ${APP_NAME}</h1>
          <p>Complete los datos para simular la creación de una cuenta.</p>
        </div>

        <form id="registerForm">
          <div class="form-group">
            <label>Nombres y apellidos</label>
            <input type="text" id="regName" required />
          </div>

          <div class="form-group">
            <label>Correo electrónico</label>
            <input type="email" id="regEmail" required />
          </div>

          <div class="form-group">
            <label>Teléfono</label>
            <input type="text" id="regPhone" required />
          </div>

          <div class="form-group">
            <label>Tipo de usuario</label>
            <select id="regRole" required>
              <option value="">Seleccione una opción</option>
              <option value="adulto">Adulto mayor</option>
              <option value="cuidador">Familiar o cuidador</option>
            </select>
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" id="regPassword" required />
          </div>

          <button class="btn btn-primary btn-full" type="submit">Registrarme</button>
          <button class="btn btn-secondary btn-full" type="button" onclick="renderLogin()">Volver</button>
        </form>
      </div>
    </section>
  `;

  document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Cuenta registrada correctamente. Ahora puede iniciar sesión.");
    renderLogin();
  });
}

function logout() {
  state.currentUser = null;
  saveData();
  renderLogin();
}

function navigate(screen) {
  state.screen = screen;
  saveData();
  renderApp();
}

function renderApp() {
  if (!state.currentUser) {
    renderLogin();
    return;
  }

  const menuAdulto = `
    <button class="nav-button ${state.screen === "dashboard" ? "active" : ""}" onclick="navigate('dashboard')">🏠 Panel principal</button>
    <button class="nav-button ${state.screen === "health" ? "active" : ""}" onclick="navigate('health')">🩺 Perfil de salud</button>
    <button class="nav-button ${state.screen === "medicines" ? "active" : ""}" onclick="navigate('medicines')">💊 Medicamentos</button>
    <button class="nav-button ${state.screen === "reminders" ? "active" : ""}" onclick="navigate('reminders')">⏰ Recordatorios</button>
    <button class="nav-button ${state.screen === "appointments" ? "active" : ""}" onclick="navigate('appointments')">📅 Citas médicas</button>
    <button class="nav-button ${state.screen === "agenda" ? "active" : ""}" onclick="navigate('agenda')">📋 Agenda médica</button>
    <button class="nav-button ${state.screen === "contacts" ? "active" : ""}" onclick="navigate('contacts')">👨‍👩‍👧 Contactos</button>
    <button class="nav-button ${state.screen === "emergency" ? "active" : ""}" onclick="navigate('emergency')">🚨 Emergencia</button>
    <button class="nav-button ${state.screen === "assistant" ? "active" : ""}" onclick="navigate('assistant')">🤖 Asistente virtual</button>
    <button class="nav-button ${state.screen === "project" ? "active" : ""}" onclick="navigate('project')">ℹ️ Proyecto</button>
  `;

  const menuCuidador = `
    <button class="nav-button ${state.screen === "dashboard" ? "active" : ""}" onclick="navigate('dashboard')">🏠 Panel principal</button>
    <button class="nav-button ${state.screen === "caregiver" ? "active" : ""}" onclick="navigate('caregiver')">👁 Panel del cuidador</button>
    <button class="nav-button ${state.screen === "agenda" ? "active" : ""}" onclick="navigate('agenda')">📋 Agenda médica</button>
    <button class="nav-button ${state.screen === "assistant" ? "active" : ""}" onclick="navigate('assistant')">🤖 Asistente virtual</button>
    <button class="nav-button ${state.screen === "project" ? "active" : ""}" onclick="navigate('project')">ℹ️ Proyecto</button>
  `;

  app.innerHTML = `
    <div class="app-layout">
      <aside class="sidebar">
        <div class="sidebar-title">
          <div class="sidebar-icon">💙</div>
          <div>
            <h2>${APP_NAME}</h2>
            <p>Prototipo académico PA3</p>
          </div>
        </div>

        ${state.currentRole === "cuidador" ? menuCuidador : menuAdulto}

        <button class="nav-button" onclick="loadDemoData()">📌 Cargar datos demo</button>
        <button class="nav-button" onclick="resetDemoData()">🧹 Limpiar datos demo</button>
        <button class="nav-button" onclick="logout()">↩ Cerrar sesión</button>

        <div class="sidebar-footer">
          <strong>${APP_NAME}</strong><br>
          PA3 - Taller de Proyectos 2<br>
          Ingeniería de Sistemas e Informática
        </div>
      </aside>

      <main class="main-area">
        <div class="topbar">
          <div>
            <h1>${getScreenTitle()}</h1>
            <p>Usuario: ${escapeHTML(state.currentUser)} | Rol: ${state.currentRole === "cuidador" ? "Familiar/Cuidador" : "Adulto mayor"}</p>
          </div>
          <button class="btn btn-danger" onclick="navigate('emergency')">🚨 Emergencia</button>
        </div>

        <div id="screenContent"></div>
      </main>
    </div>
  `;

  renderScreenContent();
}

function getScreenTitle() {
  const titles = {
    dashboard: "Panel principal",
    health: "Perfil de salud",
    medicines: "Medicamentos",
    reminders: "Recordatorios",
    appointments: "Citas médicas",
    agenda: "Agenda médica",
    contacts: "Contactos de emergencia",
    emergency: "Alerta de emergencia",
    assistant: "Asistente virtual",
    caregiver: "Panel del familiar o cuidador",
    project: "Información del proyecto"
  };

  return titles[state.screen] || "Panel principal";
}

function renderScreenContent() {
  const content = document.getElementById("screenContent");

  const screens = {
    dashboard: renderDashboard,
    health: renderHealth,
    medicines: renderMedicines,
    reminders: renderReminders,
    appointments: renderAppointments,
    agenda: renderAgenda,
    contacts: renderContacts,
    emergency: renderEmergency,
    assistant: renderAssistant,
    caregiver: renderCaregiver,
    project: renderProject
  };

  content.innerHTML = screens[state.screen] ? screens[state.screen]() : renderDashboard();

  attachEvents();
}

function renderDashboard() {
  if (state.currentRole === "cuidador") {
    return `
      <section class="content-card">
        <span class="project-label">Modo familiar/cuidador</span>
        <h2>Bienvenido a ${APP_NAME}</h2>
        <p>Desde este espacio puede revisar las alertas generadas y consultar la agenda médica registrada en el prototipo.</p>
      </section>

      <section class="grid grid-3 summary-row">
        <div class="summary-card">
          <span>Alertas registradas</span>
          <strong>${state.alerts.length}</strong>
        </div>

        <div class="summary-card">
          <span>Recordatorios</span>
          <strong>${state.reminders.length}</strong>
        </div>

        <div class="summary-card">
          <span>Contactos</span>
          <strong>${state.contacts.length}</strong>
        </div>
      </section>

      <section class="grid grid-3">
        <div class="module-card">
          <div class="big-icon">👁</div>
          <h3>Panel del cuidador</h3>
          <p>Revise alertas y avisos del adulto mayor.</p>
          <button class="btn btn-primary" onclick="navigate('caregiver')">Ingresar</button>
        </div>

        <div class="module-card">
          <div class="big-icon">📋</div>
          <h3>Agenda médica</h3>
          <p>Consulte citas y recordatorios registrados.</p>
          <button class="btn btn-primary" onclick="navigate('agenda')">Ver agenda</button>
        </div>

        <div class="module-card">
          <div class="big-icon">🤖</div>
          <h3>Asistente virtual</h3>
          <p>Realice consultas frecuentes sobre el uso del sistema.</p>
          <button class="btn btn-primary" onclick="navigate('assistant')">Consultar</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="content-card">
      <span class="project-label">Modo adulto mayor</span>
      <h2>Bienvenido a ${APP_NAME}</h2>
      <p>Seleccione una opción para registrar información de salud, medicamentos, recordatorios o activar una alerta de emergencia.</p>
    </section>

    <section class="grid grid-3 summary-row">
      <div class="summary-card">
        <span>Medicamentos registrados</span>
        <strong>${state.medicines.length}</strong>
      </div>

      <div class="summary-card">
        <span>Recordatorios pendientes</span>
        <strong>${state.reminders.filter(item => item.status === "Pendiente").length}</strong>
      </div>

      <div class="summary-card">
        <span>Contactos de emergencia</span>
        <strong>${state.contacts.length}</strong>
      </div>
    </section>

    <section class="grid grid-3">
      ${moduleCard("🩺", "Perfil de salud", "Registre información básica de salud del adulto mayor.", "health")}
      ${moduleCard("💊", "Medicamentos", "Agregue medicamentos, dosis y horarios de consumo.", "medicines")}
      ${moduleCard("⏰", "Recordatorios", "Programe avisos para medicamentos o citas médicas.", "reminders")}
      ${moduleCard("📅", "Citas médicas", "Registre próximas atenciones médicas.", "appointments")}
      ${moduleCard("👨‍👩‍👧", "Contactos", "Agregue familiares o cuidadores para emergencias.", "contacts")}
      ${moduleCard("🤖", "Asistente virtual", "Consulte dudas frecuentes sobre el uso de la aplicación.", "assistant")}

      <div class="module-card emergency-card">
        <div class="big-icon">🚨</div>
        <h3>Alerta de emergencia</h3>
        <p>Active una alerta simulada para solicitar ayuda inmediata.</p>
        <button class="btn btn-danger" onclick="navigate('emergency')">Activar emergencia</button>
      </div>
    </section>
  `;
}

function moduleCard(icon, title, text, screen) {
  return `
    <div class="module-card">
      <div class="big-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${text}</p>
      <button class="btn btn-primary" onclick="navigate('${screen}')">Ingresar</button>
    </div>
  `;
}

function renderHealth() {
  return `
    <section class="content-card">
      <h2>Registrar perfil de salud</h2>
      <form id="healthForm" class="grid grid-2">
        <div class="form-group">
          <label>Tipo de sangre</label>
          <select id="bloodType" required>
            <option value="">Seleccione</option>
            <option>O+</option>
            <option>O-</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>
        </div>

        <div class="form-group">
          <label>Peso aproximado</label>
          <input type="number" id="weight" placeholder="Ej. 68" required />
        </div>

        <div class="form-group">
          <label>Estatura aproximada</label>
          <input type="number" id="height" placeholder="Ej. 165" required />
        </div>

        <div class="form-group">
          <label>Alergias</label>
          <input type="text" id="allergies" placeholder="Ej. Penicilina" />
        </div>

        <div class="form-group">
          <label>Enfermedades o condiciones</label>
          <textarea id="conditions" placeholder="Ej. Hipertensión, diabetes, etc."></textarea>
        </div>

        <div class="form-group">
          <label>Observaciones</label>
          <textarea id="healthNotes" placeholder="Información adicional"></textarea>
        </div>

        <div class="actions">
          <button class="btn btn-primary" type="submit">Guardar perfil</button>
          <button class="btn btn-secondary" type="button" onclick="navigate('dashboard')">Volver</button>
        </div>
      </form>
    </section>

    <section class="content-card">
      <h2>Historial de salud</h2>
      ${renderHealthTable()}
    </section>
  `;
}

function renderHealthTable() {
  if (state.health.length === 0) {
    return showMessage("info", "No existen registros de salud guardados.");
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Tipo de sangre</th>
            <th>Peso</th>
            <th>Estatura</th>
            <th>Alergias</th>
            <th>Condiciones</th>
          </tr>
        </thead>
        <tbody>
          ${state.health.map(item => `
            <tr>
              <td>${escapeHTML(item.bloodType)}</td>
              <td>${escapeHTML(item.weight)} kg</td>
              <td>${escapeHTML(item.height)} cm</td>
              <td>${escapeHTML(item.allergies || "No registrado")}</td>
              <td>${escapeHTML(item.conditions || "No registrado")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderMedicines() {
  return `
    <section class="content-card">
      <h2>Registro de medicamentos</h2>
      <form id="medicineForm" class="grid grid-2">
        <div class="form-group">
          <label>Nombre del medicamento</label>
          <input type="text" id="medicineName" placeholder="Ej. Losartán" required />
        </div>

        <div class="form-group">
          <label>Dosis</label>
          <input type="text" id="medicineDose" placeholder="Ej. 50 mg" required />
        </div>

        <div class="form-group">
          <label>Horario</label>
          <input type="time" id="medicineTime" required />
        </div>

        <div class="form-group">
          <label>Frecuencia</label>
          <select id="medicineFrequency" required>
            <option value="">Seleccione</option>
            <option>Diario</option>
            <option>Cada 8 horas</option>
            <option>Cada 12 horas</option>
            <option>Semanal</option>
          </select>
        </div>

        <div class="actions">
          <button class="btn btn-primary" type="submit">Guardar medicamento</button>
          <button class="btn btn-secondary" type="button" onclick="navigate('dashboard')">Volver</button>
        </div>
      </form>
    </section>

    <section class="content-card">
      <h2>Tratamientos registrados</h2>
      ${renderMedicinesTable()}
    </section>
  `;
}

function renderMedicinesTable() {
  if (state.medicines.length === 0) {
    return showMessage("info", "Aún no se han registrado medicamentos.");
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Medicamento</th>
            <th>Dosis</th>
            <th>Horario</th>
            <th>Frecuencia</th>
          </tr>
        </thead>
        <tbody>
          ${state.medicines.map(item => `
            <tr>
              <td>${escapeHTML(item.name)}</td>
              <td>${escapeHTML(item.dose)}</td>
              <td>${escapeHTML(item.time)}</td>
              <td>${escapeHTML(item.frequency)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderReminders() {
  const medicineOptions = state.medicines.map(med => `
    <option value="${escapeHTML(med.name)}">${escapeHTML(med.name)} - ${escapeHTML(med.dose)}</option>
  `).join("");

  return `
    <section class="content-card">
      <h2>Programar recordatorio</h2>
      ${state.medicines.length === 0 ? showMessage("info", "Primero debe registrar un medicamento para programar recordatorios.") : ""}

      <form id="reminderForm" class="grid grid-2">
        <div class="form-group">
          <label>Medicamento asociado</label>
          <select id="reminderMedicine" required>
            <option value="">Seleccione medicamento</option>
            ${medicineOptions}
          </select>
        </div>

        <div class="form-group">
          <label>Fecha</label>
          <input type="date" id="reminderDate" required />
        </div>

        <div class="form-group">
          <label>Hora</label>
          <input type="time" id="reminderTime" required />
        </div>

        <div class="form-group">
          <label>Frecuencia</label>
          <select id="reminderFrequency" required>
            <option value="">Seleccione</option>
            <option>Diario</option>
            <option>Cada 8 horas</option>
            <option>Cada 12 horas</option>
            <option>Semanal</option>
          </select>
        </div>

        <div class="actions">
          <button class="btn btn-primary" type="submit">Guardar recordatorio</button>
          <button class="btn btn-secondary" type="button" onclick="navigate('dashboard')">Volver</button>
        </div>
      </form>
    </section>

    <section class="content-card">
      <h2>Próximos recordatorios</h2>
      ${renderRemindersTable()}
    </section>
  `;
}

function renderRemindersTable() {
  if (state.reminders.length === 0) {
    return showMessage("info", "No existen recordatorios programados.");
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Medicamento</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Frecuencia</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${state.reminders.map((item, index) => `
            <tr>
              <td>${escapeHTML(item.medicine)}</td>
              <td>${escapeHTML(item.date)}</td>
              <td>${escapeHTML(item.time)}</td>
              <td>${escapeHTML(item.frequency)}</td>
              <td>
                <span class="badge">${escapeHTML(item.status)}</span><br><br>
                ${item.status === "Pendiente" ? `<button class="btn btn-secondary" onclick="confirmReminder(${index})">Confirmar toma</button>` : ""}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function confirmReminder(index) {
  state.reminders[index].status = "Confirmado";
  state.reminders[index].confirmedAt = new Date().toLocaleString();
  saveData();
  renderApp();
}

function renderAppointments() {
  return `
    <section class="content-card">
      <h2>Registrar cita médica</h2>
      <form id="appointmentForm" class="grid grid-2">
        <div class="form-group">
          <label>Fecha</label>
          <input type="date" id="appointmentDate" required />
        </div>

        <div class="form-group">
          <label>Hora</label>
          <input type="time" id="appointmentTime" required />
        </div>

        <div class="form-group">
          <label>Especialidad</label>
          <input type="text" id="appointmentSpecialty" placeholder="Ej. Cardiología" required />
        </div>

        <div class="form-group">
          <label>Observaciones</label>
          <textarea id="appointmentNotes" placeholder="Ej. Llevar resultados de análisis"></textarea>
        </div>

        <div class="actions">
          <button class="btn btn-primary" type="submit">Guardar cita</button>
          <button class="btn btn-secondary" type="button" onclick="navigate('dashboard')">Volver</button>
        </div>
      </form>
    </section>
  `;
}

function renderAgenda() {
  return `
    <section class="content-card">
      <h2>Agenda médica</h2>
      <p>En esta sección se muestran los recordatorios y citas médicas registradas en el prototipo.</p>
    </section>

    <section class="content-card">
      <h2>Recordatorios</h2>
      ${renderRemindersTable()}
    </section>

    <section class="content-card">
      <h2>Citas médicas</h2>
      ${renderAppointmentsTable()}
    </section>
  `;
}

function renderAppointmentsTable() {
  if (state.appointments.length === 0) {
    return showMessage("info", "No existen citas médicas registradas.");
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Especialidad</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          ${state.appointments.map(item => `
            <tr>
              <td>${escapeHTML(item.date)}</td>
              <td>${escapeHTML(item.time)}</td>
              <td>${escapeHTML(item.specialty)}</td>
              <td>${escapeHTML(item.notes || "Sin observaciones")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderContacts() {
  return `
    <section class="content-card">
      <h2>Contactos de emergencia</h2>
      <form id="contactForm" class="grid grid-2">
        <div class="form-group">
          <label>Nombre del contacto</label>
          <input type="text" id="contactName" placeholder="Ej. María López" required />
        </div>

        <div class="form-group">
          <label>Teléfono</label>
          <input type="text" id="contactPhone" placeholder="Ej. 987654321" required />
        </div>

        <div class="form-group">
          <label>Parentesco</label>
          <input type="text" id="contactRelation" placeholder="Ej. Hija, nieto, cuidador" required />
        </div>

        <div class="form-group">
          <label>Medio de contacto</label>
          <select id="contactMethod" required>
            <option value="">Seleccione</option>
            <option>Llamada</option>
            <option>SMS</option>
            <option>Correo</option>
            <option>WhatsApp</option>
          </select>
        </div>

        <div class="actions">
          <button class="btn btn-primary" type="submit">Guardar contacto</button>
          <button class="btn btn-secondary" type="button" onclick="navigate('dashboard')">Volver</button>
        </div>
      </form>
    </section>

    <section class="content-card">
      <h2>Contactos registrados</h2>
      ${renderContactsTable()}
    </section>
  `;
}

function renderContactsTable() {
  if (state.contacts.length === 0) {
    return showMessage("info", "No existen contactos de emergencia registrados.");
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Parentesco</th>
            <th>Medio</th>
          </tr>
        </thead>
        <tbody>
          ${state.contacts.map(item => `
            <tr>
              <td>${escapeHTML(item.name)}</td>
              <td>${escapeHTML(item.phone)}</td>
              <td>${escapeHTML(item.relation)}</td>
              <td>${escapeHTML(item.method)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderEmergency() {
  return `
    <section class="content-card emergency-card">
      <h2 class="danger-title">Alerta de emergencia</h2>
      <p>Presione el botón para simular una solicitud de ayuda inmediata a los contactos registrados.</p>

      <div class="actions">
        <button class="btn btn-danger" id="emergencyButton">🚨 Activar alerta de emergencia</button>
        <button class="btn btn-secondary" onclick="navigate('dashboard')">Volver</button>
      </div>

      <p class="footer-note">
        Esta función corresponde a una simulación académica. No envía mensajes reales a hospitales, clínicas o servicios externos de emergencia.
      </p>
    </section>

    <section class="content-card">
      <h2>Alertas generadas</h2>
      ${renderAlertsTable()}
    </section>
  `;
}

function renderAlertsTable() {
  if (state.alerts.length === 0) {
    return showMessage("info", "No existen alertas generadas.");
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Fecha y hora</th>
            <th>Estado</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          ${state.alerts.map(item => `
            <tr>
              <td>${escapeHTML(item.date)}</td>
              <td><span class="badge">${escapeHTML(item.status)}</span></td>
              <td>${escapeHTML(item.detail)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderAssistant() {
  return `
    <section class="content-card">
      <h2>Asistente virtual</h2>
      <p>Realice una consulta frecuente sobre el uso de la aplicación.</p>

      <div class="assistant-box" id="chatBox">
        <div class="chat-message chat-bot">
          Hola, soy el asistente virtual de ${APP_NAME}. Puedo orientarte sobre recordatorios, medicamentos, citas, contactos y emergencias.
        </div>
      </div>

      <form id="assistantForm" class="grid grid-2" style="margin-top: 16px;">
        <div class="form-group">
          <label>Consulta</label>
          <input type="text" id="assistantInput" placeholder="Ej. ¿Cómo registro un medicamento?" required />
        </div>

        <div class="actions">
          <button class="btn btn-primary" type="submit">Enviar consulta</button>
          <button class="btn btn-secondary" type="button" onclick="navigate('dashboard')">Volver</button>
        </div>
      </form>

      <p class="footer-note">
        El asistente virtual no reemplaza la atención de un profesional de salud ni brinda diagnósticos médicos.
      </p>
    </section>
  `;
}

function renderCaregiver() {
  return `
    <section class="content-card">
      <h2>Panel del familiar o cuidador</h2>
      <p>Este panel permite revisar alertas de emergencia y avisos relacionados con el adulto mayor.</p>
    </section>

    <section class="content-card">
      <h2>Alertas recibidas</h2>
      ${renderAlertsTable()}
    </section>

    <section class="content-card">
      <h2>Contactos registrados</h2>
      ${renderContactsTable()}
    </section>
  `;
}

function renderProject() {
  return `
    <section class="content-card">
      <span class="project-label">Producto Académico 3</span>
      <h2>${APP_NAME}</h2>
      <p>
        Prototipo web del proyecto “Asistente virtual inteligente para adultos mayores con monitoreo de salud,
        recordatorios médicos y detección de emergencias”.
      </p>
      <p>
        Esta versión fue desarrollada como evidencia académica para mostrar la navegación, interfaces,
        validaciones básicas y flujos principales relacionados con medicamentos, recordatorios, citas médicas,
        contactos y alertas de emergencia.
      </p>
    </section>

    <section class="content-card">
      <h2>Integrantes del equipo</h2>
      <div class="team-list">
        ${TEAM_MEMBERS.map(member => `<div class="team-member">${escapeHTML(member)}</div>`).join("")}
      </div>
    </section>

    <section class="content-card">
      <h2>Alcance del prototipo</h2>
      <p>
        El prototipo utiliza datos simulados y almacenamiento local del navegador. No cuenta con base de datos real,
        conexión a hospitales, sensores médicos ni envío real de mensajes. Su finalidad es representar el funcionamiento
        esperado de la aplicación para fines de validación académica.
      </p>
    </section>
  `;
}

function attachEvents() {
  const healthForm = document.getElementById("healthForm");
  if (healthForm) {
    healthForm.addEventListener("submit", function (event) {
      event.preventDefault();

      state.health.push({
        bloodType: document.getElementById("bloodType").value,
        weight: document.getElementById("weight").value,
        height: document.getElementById("height").value,
        allergies: document.getElementById("allergies").value,
        conditions: document.getElementById("conditions").value,
        notes: document.getElementById("healthNotes").value
      });

      saveData();
      alert("Perfil de salud guardado correctamente.");
      renderApp();
    });
  }

  const medicineForm = document.getElementById("medicineForm");
  if (medicineForm) {
    medicineForm.addEventListener("submit", function (event) {
      event.preventDefault();

      state.medicines.push({
        name: document.getElementById("medicineName").value,
        dose: document.getElementById("medicineDose").value,
        time: document.getElementById("medicineTime").value,
        frequency: document.getElementById("medicineFrequency").value
      });

      saveData();
      alert("Medicamento registrado correctamente.");
      renderApp();
    });
  }

  const reminderForm = document.getElementById("reminderForm");
  if (reminderForm) {
    reminderForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (state.medicines.length === 0) {
        alert("Primero debe registrar un medicamento.");
        return;
      }

      state.reminders.push({
        medicine: document.getElementById("reminderMedicine").value,
        date: document.getElementById("reminderDate").value,
        time: document.getElementById("reminderTime").value,
        frequency: document.getElementById("reminderFrequency").value,
        status: "Pendiente"
      });

      saveData();
      alert("Recordatorio programado correctamente.");
      renderApp();
    });
  }

  const appointmentForm = document.getElementById("appointmentForm");
  if (appointmentForm) {
    appointmentForm.addEventListener("submit", function (event) {
      event.preventDefault();

      state.appointments.push({
        date: document.getElementById("appointmentDate").value,
        time: document.getElementById("appointmentTime").value,
        specialty: document.getElementById("appointmentSpecialty").value,
        notes: document.getElementById("appointmentNotes").value
      });

      saveData();
      alert("Cita médica registrada correctamente.");
      renderApp();
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      state.contacts.push({
        name: document.getElementById("contactName").value,
        phone: document.getElementById("contactPhone").value,
        relation: document.getElementById("contactRelation").value,
        method: document.getElementById("contactMethod").value
      });

      saveData();
      alert("Contacto de emergencia registrado correctamente.");
      renderApp();
    });
  }

  const emergencyButton = document.getElementById("emergencyButton");
  if (emergencyButton) {
    emergencyButton.addEventListener("click", function () {
      const confirmAlert = confirm("¿Desea activar la alerta de emergencia?");

      if (!confirmAlert) {
        alert("La alerta de emergencia fue cancelada.");
        return;
      }

      if (state.contacts.length === 0) {
        state.alerts.push({
          date: new Date().toLocaleString(),
          status: "Sin destinatario",
          detail: "Alerta registrada, pero no existen contactos de emergencia."
        });

        saveData();
        alert("No existen contactos de emergencia registrados. Agregue un contacto para enviar alertas.");
        renderApp();
        return;
      }

      state.alerts.push({
        date: new Date().toLocaleString(),
        status: "Notificación enviada",
        detail: `Alerta enviada a ${state.contacts.length} contacto(s) registrado(s).`
      });

      saveData();
      alert("Alerta de emergencia generada correctamente. Notificación enviada al contacto de emergencia.");
      renderApp();
    });
  }

  const assistantForm = document.getElementById("assistantForm");
  if (assistantForm) {
    assistantForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const input = document.getElementById("assistantInput");
      const question = input.value.trim();

      if (!question) {
        alert("Debe ingresar una consulta.");
        return;
      }

      const chatBox = document.getElementById("chatBox");
      chatBox.innerHTML += `<div class="chat-message chat-user">${escapeHTML(question)}</div>`;
      chatBox.innerHTML += `<div class="chat-message chat-bot">${getAssistantAnswer(question)}</div>`;

      input.value = "";
    });
  }
}

function getAssistantAnswer(question) {
  const text = question.toLowerCase();

  if (text.includes("medicamento")) {
    return "Para registrar un medicamento, ingrese al módulo Medicamentos, complete nombre, dosis, horario y frecuencia. Luego presione Guardar medicamento.";
  }

  if (text.includes("recordatorio")) {
    return "Para programar un recordatorio, primero debe tener un medicamento registrado. Luego ingrese a Recordatorios y seleccione fecha, hora y frecuencia.";
  }

  if (text.includes("cita")) {
    return "Para registrar una cita médica, ingrese al módulo Citas médicas y complete fecha, hora, especialidad y observaciones.";
  }

  if (text.includes("contacto")) {
    return "Para agregar un contacto de emergencia, ingrese al módulo Contactos y registre nombre, teléfono, parentesco y medio de contacto.";
  }

  if (text.includes("emergencia") || text.includes("alerta")) {
    return "Para activar una alerta, presione el botón Emergencia y confirme la acción. Esta versión solo simula el envío de notificaciones.";
  }

  return "Puedo ayudarte con consultas sobre medicamentos, recordatorios, citas médicas, contactos de emergencia y uso general de la aplicación.";
}

loadData();
renderApp();