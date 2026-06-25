CREATE DATABASE IF NOT EXISTS cuidapp_mayor
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE cuidapp_mayor;

-- ============================================================
-- Tabla: usuarios
-- Almacena adultos mayores, familiares y cuidadores.
-- ============================================================

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('adulto_mayor', 'familiar', 'cuidador') NOT NULL,
    telefono VARCHAR(20),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Tabla: perfiles_salud
-- Registra información básica de salud del adulto mayor.
-- ============================================================

CREATE TABLE perfiles_salud (
    id_perfil INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo_sangre VARCHAR(5),
    peso DECIMAL(5,2),
    altura DECIMAL(5,2),
    enfermedades TEXT,
    alergias TEXT,
    observaciones TEXT,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_perfil_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================
-- Tabla: medicamentos
-- Almacena medicamentos, dosis y horarios del adulto mayor.
-- ============================================================

CREATE TABLE medicamentos (
    id_medicamento INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    dosis VARCHAR(50) NOT NULL,
    horario TIME NOT NULL,
    frecuencia VARCHAR(50) DEFAULT 'Diario',
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_medicamento_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================
-- Tabla: citas_medicas
-- Registra citas médicas programadas por el usuario.
-- ============================================================

CREATE TABLE citas_medicas (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha DATETIME NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    observaciones TEXT,
    estado ENUM('programada', 'atendida', 'cancelada') DEFAULT 'programada',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cita_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================
-- Tabla: contactos_emergencia
-- Almacena familiares o cuidadores para recibir alertas.
-- ============================================================

CREATE TABLE contactos_emergencia (
    id_contacto INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    parentesco VARCHAR(50) NOT NULL,
    medio_contacto ENUM('llamada', 'sms', 'correo', 'whatsapp') DEFAULT 'llamada',
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_contacto_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================
-- Tabla: recordatorios
-- Administra recordatorios de medicamentos o citas médicas.
-- Puede estar asociado a un medicamento o a una cita.
-- ============================================================

CREATE TABLE recordatorios (
    id_recordatorio INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_medicamento INT NULL,
    id_cita INT NULL,
    fecha_hora DATETIME NOT NULL,
    tipo ENUM('medicamento', 'cita_medica') NOT NULL,
    estado ENUM('pendiente', 'confirmado', 'vencido', 'cancelado') DEFAULT 'pendiente',
    fecha_confirmacion DATETIME NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_recordatorio_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_recordatorio_medicamento
        FOREIGN KEY (id_medicamento)
        REFERENCES medicamentos(id_medicamento)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_recordatorio_cita
        FOREIGN KEY (id_cita)
        REFERENCES citas_medicas(id_cita)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_recordatorio_referencia
        CHECK (
            (tipo = 'medicamento' AND id_medicamento IS NOT NULL)
            OR
            (tipo = 'cita_medica' AND id_cita IS NOT NULL)
        )
);

-- ============================================================
-- Tabla: alertas_emergencia
-- Registra alertas generadas por el adulto mayor.
-- ============================================================

CREATE TABLE alertas_emergencia (
    id_alerta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('generada', 'notificada', 'atendida', 'sin_contactos') DEFAULT 'generada',
    descripcion TEXT,
    cantidad_contactos_notificados INT DEFAULT 0,

    CONSTRAINT fk_alerta_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================
-- Tabla: consultas_asistente
-- Guarda consultas frecuentes realizadas al asistente virtual.
-- ============================================================

CREATE TABLE consultas_asistente (
    id_consulta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    pregunta TEXT NOT NULL,
    respuesta TEXT NOT NULL,
    fecha_consulta DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_consulta_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================
-- Índices
-- ============================================================

CREATE INDEX idx_usuarios_correo ON usuarios(correo);
CREATE INDEX idx_medicamentos_usuario ON medicamentos(id_usuario);
CREATE INDEX idx_recordatorios_usuario_fecha ON recordatorios(id_usuario, fecha_hora);
CREATE INDEX idx_citas_usuario_fecha ON citas_medicas(id_usuario, fecha);
CREATE INDEX idx_alertas_usuario_fecha ON alertas_emergencia(id_usuario, fecha_hora);
CREATE INDEX idx_contactos_usuario ON contactos_emergencia(id_usuario);

-- ============================================================
-- Datos de prueba
-- ============================================================

INSERT INTO usuarios 
(nombres, apellidos, correo, password_hash, rol, telefono)
VALUES
('Adulto', 'Mayor Demo', 'adulto.mayor@test.com', '123456_demo_hash', 'adulto_mayor', '900111222'),
('Familiar', 'Demo', 'familiar.test@test.com', '123456_demo_hash', 'familiar', '900333444');

INSERT INTO perfiles_salud
(id_usuario, tipo_sangre, peso, altura, enfermedades, alergias, observaciones)
VALUES
(1, 'O+', 68.00, 165.00, 'Hipertensión controlada', 'Penicilina', 'Requiere seguimiento de presión arterial.');

INSERT INTO medicamentos
(id_usuario, nombre, dosis, horario, frecuencia)
VALUES
(1, 'Losartán', '50 mg', '08:00:00', 'Diario'),
(1, 'Metformina', '850 mg', '20:00:00', 'Diario');

INSERT INTO citas_medicas
(id_usuario, fecha, especialidad, observaciones)
VALUES
(1, '2026-07-18 10:30:00', 'Cardiología', 'Llevar últimos resultados de presión arterial.'),
(1, '2026-07-25 09:00:00', 'Medicina general', 'Control mensual de tratamiento.');

INSERT INTO contactos_emergencia
(id_usuario, nombres, telefono, parentesco, medio_contacto)
VALUES
(1, 'María López', '987654321', 'Hija', 'whatsapp'),
(1, 'Carlos Ramírez', '912345678', 'Cuidador', 'llamada');

INSERT INTO recordatorios
(id_usuario, id_medicamento, id_cita, fecha_hora, tipo, estado)
VALUES
(1, 1, NULL, '2026-07-15 08:00:00', 'medicamento', 'pendiente'),
(1, 2, NULL, '2026-07-15 20:00:00', 'medicamento', 'pendiente'),
(1, NULL, 1, '2026-07-18 09:30:00', 'cita_medica', 'pendiente');

INSERT INTO alertas_emergencia
(id_usuario, estado, descripcion, cantidad_contactos_notificados)
VALUES
(1, 'notificada', 'Alerta de emergencia de prueba enviada a contactos registrados.', 2);

INSERT INTO consultas_asistente
(id_usuario, pregunta, respuesta)
VALUES
(1, '¿Cómo registro un medicamento?', 'Ingrese al módulo Medicamentos, complete nombre, dosis, horario y frecuencia. Luego presione Guardar medicamento.'),
(1, '¿Cómo activo una emergencia?', 'Presione el botón Emergencia y confirme la acción. En el prototipo se simula el envío de la alerta.');