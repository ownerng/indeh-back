-- Este trigger se activa después de insertar un nuevo estudiante en la tabla 'students'.
-- Para cada nuevo estudiante, inserta una fila en la tabla 'califications'
-- para cada asignatura existente en la tabla 'subjects', con la calificación inicial como NULL.

-- Primero, creamos una función que será ejecutada por el trigger.
-- Esta función itera sobre todas las asignaturas e inserta una fila en 'califications'.
CREATE OR REPLACE FUNCTION assign_subjects_to_new_student()
RETURNS TRIGGER AS $$
DECLARE
    subject_record RECORD;
BEGIN
    -- Iterar sobre todas las asignaturas en la tabla 'subjects'
    FOR subject_record IN SELECT id FROM subjects LOOP
        -- Insertar una nueva fila en la tabla 'califications'
        -- NEW.id se refiere al ID del estudiante recién insertado en la tabla 'students'
        INSERT INTO califications (id, id_student, id_subject, calificacion, fecha_creacion, fecha_modificacion)
        VALUES (
            uuid_generate_v4(), -- Genera un nuevo UUID para la calificación (asumiendo PostgreSQL)
            NEW.id,             -- El ID del estudiante recién insertado
            subject_record.id,  -- El ID de la asignatura
            NULL,               -- La calificación inicial es NULL
            NOW(),              -- La fecha de creación es la actual
            NULL                -- La fecha de modificación inicial es NULL
        );
    END LOOP;

    -- Retornar NEW para indicar que la inserción en 'students' debe completarse
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Luego, creamos el trigger que llama a la función después de una inserción en 'students'.
CREATE TRIGGER after_student_insert_assign_subjects
AFTER INSERT ON students
FOR EACH ROW
EXECUTE FUNCTION assign_subjects_to_new_student();
