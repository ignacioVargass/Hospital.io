<?php
include 'conexion.php';  // Asegúrate de que la ruta sea correcta

// Verifica si la conexión está activa
if ($conn->ping()) {
    echo "Conexión exitosa!";
} else {
    echo "Error en la conexión: " . $conn->error;
}
?>
