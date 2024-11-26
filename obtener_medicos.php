<?php
include 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['especialidad'])) {
    $especialidad = $_POST['especialidad'];
    echo "Especialidad seleccionada: " . $especialidad; // Depuración

    // Consulta para obtener médicos según la especialidad
    $sql = "SELECT id_medico, CONCAT(nombre, ' ', apellido) AS nombre_completo FROM medico WHERE especialidad = ?";
    $stmt = $conn->prepare($sql);
    
    if ($stmt === false) {
        // Mostrar error de preparación de consulta
        die('Error en la preparación de la consulta: ' . $conn->error);
    }

    $stmt->bind_param("s", $especialidad);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result === false) {
        // Mostrar error en la ejecución de la consulta
        die('Error en la ejecución de la consulta: ' . $stmt->error);
    }

    $medicos = [];
    while ($row = $result->fetch_assoc()) {
        $medicos[] = $row;
    }

    // Devolver los datos en formato JSON
    echo json_encode($medicos);
}
?>
