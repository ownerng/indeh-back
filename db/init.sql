CREATE OR REPLACE FUNCTION assign_subjects_to_new_student()
RETURNS TRIGGER AS $$
DECLARE
    subject_record RECORD;
BEGIN
    FOR subject_record IN SELECT id FROM subjects LOOP
        INSERT INTO califications (id_student, id_subject, calificacion, fecha_creacion, fecha_modificacion)
        VALUES (
            NEW.id,             -- El ID del estudiante recién insertado (asumiendo que es UUID)
            subject_record.id,  -- El ID de la asignatura (asumiendo que es UUID)
            NULL,               -- La calificación inicial es NULL
            NOW(),              -- La fecha de creación es la actual
            NULL                -- La fecha de modificación inicial es NULL
        );
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER after_student_insert_assign_subjects
AFTER INSERT ON students
FOR EACH ROW
EXECUTE FUNCTION assign_subjects_to_new_student();

INSERT INTO subjects (id, nombre, estado, fecha_creacion, fecha_modificacion) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Matemáticas', 'Activo', NOW(), NOW()),
('f9e8d7c6-b5a4-3210-fedc-ba9876543210', 'Lenguaje', 'Activo', NOW(), NOW()),
('10293847-5674-3821-abcd-ef1234567890', 'Ciencias Naturales', 'Activo', NOW(), NOW()),
('09876543-210f-edcb-a987-6543210fedcb', 'Ciencias Sociales', 'Activo', NOW(), NOW()),
('b4d2e1c3-f6a5-8790-3412-90abcdef5678', 'Inglés', 'Activo', NOW(), NOW()),
('7c6b5a4d-3e2f-1809-4765-210fedcba987', 'Educación Física', 'Activo', NOW(), NOW()),
('3821abcd-ef12-3456-7890-102938475674', 'Artes Plásticas', 'Activo', NOW(), NOW()),
('6543210f-edcb-a987-8765-43210fedcba9', 'Tecnología e Informática', 'Activo', NOW(), NOW()),
('e1c3b4d2-a5f6-9087-1234-567890abcdef', 'Filosofía', 'Activo', NOW(), NOW()),
('d7c6f9e8-a4b5-1032-fedc-ba9876543210', 'Química', 'Activo', NOW(), NOW()),
('47567438-21ab-cdef-1234-567890102938', 'Física', 'Activo', NOW(), NOW()),
('210fedcb-a987-6543-3210-fedcba987654', 'Biología', 'Activo', NOW(), NOW());

INSERT INTO users (username, password) VALUES ('angelica', '1006794221');