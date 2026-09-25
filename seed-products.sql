-- Script para insertar 20 camisetas de ejemplo en la tienda J21 Store
-- Ejecutar en el SQL Editor de Supabase

INSERT INTO products (name, team, size, price, image_url, stock) VALUES
-- La Liga
('Camiseta Local 2024/25', 'Real Madrid', 'M', 35000, '', 15),
('Camiseta Visitante 2024/25', 'Real Madrid', 'L', 35000, '', 8),
('Camiseta Local 2024/25', 'Barcelona', 'M', 35000, '', 12),
('Camiseta Tercera 2024/25', 'Barcelona', 'S', 33000, '', 6),
('Camiseta Local 2024/25', 'Atlético Madrid', 'L', 32000, '', 10),

-- Premier League
('Camiseta Local 2024/25', 'Manchester City', 'M', 34000, '', 9),
('Camiseta Visitante 2024/25', 'Manchester United', 'XL', 34000, '', 7),
('Camiseta Local 2024/25', 'Liverpool', 'L', 33000, '', 11),
('Camiseta Local 2024/25', 'Arsenal', 'M', 33000, '', 5),
('Camiseta Visitante 2024/25', 'Chelsea', 'S', 32000, '', 8),

-- Serie A
('Camiseta Local 2024/25', 'Juventus', 'L', 31000, '', 13),
('Camiseta Local 2024/25', 'AC Milan', 'M', 31000, '', 10),
('Camiseta Visitante 2024/25', 'Inter Milan', 'XL', 31000, '', 6),
('Camiseta Local 2024/25', 'Napoli', 'M', 30000, '', 9),

-- Bundesliga
('Camiseta Local 2024/25', 'Bayern Munich', 'L', 33000, '', 14),
('Camiseta Visitante 2024/25', 'Borussia Dortmund', 'M', 32000, '', 7),

-- Selecciones
('Camiseta Local 2024', 'Argentina', 'M', 28000, '', 20),
('Camiseta Visitante 2024', 'Argentina', 'L', 28000, '', 15),
('Camiseta Local 2024', 'Brasil', 'M', 27000, '', 12),
('Camiseta Local 2024', 'España', 'S', 29000, '', 8);

-- Verificar que se insertaron correctamente
SELECT COUNT(*) as total_productos FROM products;
SELECT team, COUNT(*) as cantidad FROM products GROUP BY team ORDER BY cantidad DESC;
