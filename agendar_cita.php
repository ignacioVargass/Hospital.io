<?php
include 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener datos del formulario
    $nombre_paciente = $_POST['nombre_paciente'];
    $apellido_paciente = $_POST['apellido_paciente'];
    $id_medico = isset($_POST['id_medico']) ? $_POST['id_medico'] : null; // Verificar si existe
    $fecha_cita = $_POST['fecha_cita'];
    $fecha_nacimiento = isset($_POST['fecha_nacimiento']) ? $_POST['fecha_nacimiento'] : null; // Verificar si existe
    $motivo_consulta = $_POST['motivo_consulta'];
    $id_servicio = $_POST['id_servicio'];

    // Verificar si el paciente ya existe
    $sql = "SELECT id_paciente FROM paciente WHERE nombre = ? AND apellido = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $nombre_paciente, $apellido_paciente);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 0) {
        // Paciente no existe, insertarlo
        $sql_insert_paciente = "INSERT INTO paciente (nombre, apellido, fecha_nacimiento) VALUES (?, ?, ?)";
        $stmt_insert = $conn->prepare($sql_insert_paciente);
        $stmt_insert->bind_param("sss", $nombre_paciente, $apellido_paciente, $fecha_nacimiento);
        $stmt_insert->execute();
        $id_paciente = $stmt_insert->insert_id; // Obtener ID del nuevo paciente
    } else {
        // Paciente ya existe, obtener ID
        $row = $result->fetch_assoc();
        $id_paciente = $row['id_paciente'];
    }

    // Verificar si el servicio existe
    $sql_check_servicio = "SELECT id_servicio FROM servicio WHERE id_servicio = ?";
    $stmt_check_servicio = $conn->prepare($sql_check_servicio);
    $stmt_check_servicio->bind_param("i", $id_servicio);
    $stmt_check_servicio->execute();
    $result_servicio = $stmt_check_servicio->get_result();

    if ($result_servicio->num_rows == 0) {
        echo "Error: El servicio no existe.";
        exit;
    }

    // Insertar la cita en la base de datos
    $sql_insert_cita = "INSERT INTO cita (id_paciente, id_medico, fecha_cita, motivo_consulta, id_servicio) VALUES (?, ?, ?, ?, ?)";
    $stmt_cita = $conn->prepare($sql_insert_cita);
    $stmt_cita->bind_param("iisss", $id_paciente, $id_medico, $fecha_cita, $motivo_consulta, $id_servicio);

    if ($stmt_cita->execute()) {
        echo "Cita agendada con éxito";
    } else {
        echo "Error al agendar la cita: " . $stmt_cita->error;
    }

    // Cerrar las conexiones
    $stmt->close();
    $stmt_insert->close();
    $stmt_cita->close();
    $stmt_check_servicio->close();
    $conn->close();
}
?>