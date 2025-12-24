-- Insert Categories
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
('sides', 'Sides', '🍚', 1, true),
('main-dish', 'Main Dish', '🍖', 2, true),
('appetizer', 'Appetizer', '🍢', 3, true),
('drinks', 'Drinks', '🥤', 4, true)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    icon = EXCLUDED.icon,
    active = EXCLUDED.active;

-- Insert Menu Items (Sides)
INSERT INTO menu_items (name, description, base_price, category, available, image_url) VALUES
('Puso', 'Native hanging rice', 10, 'sides', true, 'https://images.unsplash.com/photo-1621255574577-67c004738596?q=80&w=2070&auto=format&fit=crop');

-- Insert Menu Items (Main Dish)
INSERT INTO menu_items (name, description, base_price, category, available, image_url) VALUES
('Pork BBQ', 'Classic Visayan spiced pork barbecue', 35, 'main-dish', true, 'https://images.unsplash.com/photo-1529193591184-b1d580690dd0?q=80&w=2070&auto=format&fit=crop'),
('Chicken BBQ', 'Classic Visayan spiced chicken barbecue', 140, 'main-dish', true, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=2070&auto=format&fit=crop'),
('Chorizo', 'Classic Visayan spiced chorizo', 45, 'main-dish', true, 'https://images.unsplash.com/photo-1573335553610-a871d6c84530?q=80&w=2070&auto=format&fit=crop'),
('Pork Belly', 'Classic Visayan spiced pork belly', 80, 'main-dish', true, 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?q=80&w=2070&auto=format&fit=crop'),
('Atay Batikon', 'Classic Visayan spiced liver and gizzard', 30, 'main-dish', true, 'https://images.unsplash.com/photo-1604909052743-94e838986d24?q=80&w=2080&auto=format&fit=crop'),
('Pork Liver', 'Classic Visayan spiced pork liver', 30, 'main-dish', true, 'https://images.unsplash.com/photo-1626804475297-41108929f697?q=80&w=2070&auto=format&fit=crop');

-- Insert Menu Items (Appetizer)
INSERT INTO menu_items (name, description, base_price, category, available, image_url) VALUES
('Sisig', 'Authentic Cebu street food sisig', 250, 'appetizer', true, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=2070&auto=format&fit=crop'),
('Siomai (3pcs)', 'Authentic Cebu street food siomai', 30, 'appetizer', true, 'https://images.unsplash.com/photo-1695574516766-3d2b270726d4?q=80&w=2070&auto=format&fit=crop'),
('Squid Balls (3pcs)', 'Authentic Cebu street food squid balls', 35, 'appetizer', true, 'https://images.unsplash.com/photo-1599488661642-1bf6688755b6?q=80&w=2070&auto=format&fit=crop'),
('Tempura (3pcs)', 'Authentic Cebu street food tempura', 30, 'appetizer', true, 'https://images.unsplash.com/photo-1629854746687-0b1a134a4073?q=80&w=2070&auto=format&fit=crop'),
('Kikiam (3pcs)', 'Authentic Cebu street food kikiam', 35, 'appetizer', true, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=2129&auto=format&fit=crop'),
('Kwek-kwek', 'Authentic Cebu street food kwek-kwek', 30, 'appetizer', true, 'https://images.unsplash.com/photo-1579888944880-d98341245702?q=80&w=2070&auto=format&fit=crop'),
('Kinupusan', 'Authentic Cebu street food kinupusan', 100, 'appetizer', true, null),
('Ngo Hiong', 'Authentic Cebu street food ngo hiong', 10, 'appetizer', true, 'https://images.unsplash.com/photo-1631515243349-e0605143000b?q=80&w=2070&auto=format&fit=crop'),
('Chicharon Bulaklak', 'Authentic Cebu street food chicharon bulaklak', 300, 'appetizer', true, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=2070&auto=format&fit=crop'),
('Jowl/Aping', 'Authentic Cebu street food jowl/aping', 70, 'appetizer', true, null),
('Chicharon', 'Authentic Cebu street food chicharon', 100, 'appetizer', true, 'https://images.unsplash.com/photo-1616258079633-8a3d463d8199?q=80&w=2069&auto=format&fit=crop');

-- Insert Menu Items (Drinks)
INSERT INTO menu_items (name, description, base_price, category, available, image_url) VALUES
('Mountain Dew', 'Refreshing soda', 65, 'drinks', true, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2070&auto=format&fit=crop'),
('Red Horse', 'Extra strong beer', 75, 'drinks', true, 'https://images.unsplash.com/photo-1629205567702-69f201083162?q=80&w=2070&auto=format&fit=crop'),
('Pilsen', 'Classic pale pilsen', 95, 'drinks', true, 'https://images.unsplash.com/photo-1608677725965-0c7cb993132e?q=80&w=2070&auto=format&fit=crop'),
('San Mig Light', 'Low calorie beer', 95, 'drinks', true, 'https://images.unsplash.com/photo-1650119846066-6b199042c169?q=80&w=2070&auto=format&fit=crop'),
('Mineral Water', 'Bottled water', 35, 'drinks', true, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=1976&auto=format&fit=crop');

-- Insert Default Site Settings
INSERT INTO site_settings (id, value, type, description) VALUES
('site_name', 'Iskina Puso', 'text', 'The name of the website'),
('site_description', 'Authentic Cebuano Street Food', 'text', 'The description of the website'),
('currency', '₱', 'text', 'Currency symbol'),
('currency_code', 'PHP', 'text', 'Currency code'),
('opening_time', '08:00', 'text', 'Store opening time'),
('closing_time', '22:00', 'text', 'Store closing time'),
('is_temporarily_closed', 'false', 'boolean', 'Temporary store closure status')
ON CONFLICT (id) DO UPDATE SET 
    value = EXCLUDED.value,
    type = EXCLUDED.type,
    description = EXCLUDED.description;
