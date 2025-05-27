-- ## Organization (Adding 3 more)
INSERT INTO organization (id, name) VALUES (2, 'Innovate Solutions');
INSERT INTO organization (id, name) VALUES (3, 'Global Parts Inc.');
INSERT INTO organization (id, name) VALUES (4, 'Future Tech Supplies');
INSERT INTO organization (id, name) VALUES (1, 'Test Org');

-- ## User (Adding 3 more, using existing 'testuser' as ID 1)
INSERT INTO "user" (id, username, password_hash, email, phone, role, organizationId) VALUES (2, 'admin_user', '5678', 'admin@innovate.com', '0987654321', 'admin', 2);
INSERT INTO "user" (id, username, password_hash, email, phone, role, organizationId) VALUES (3, 'manager_gp', 'abcd', 'manager@globalparts.com', '1122334455', 'manager', 3);
INSERT INTO "user" (id, username, password_hash, email, phone, role, organizationId) VALUES (4, 'staff_ft', 'efgh', 'staff@futuretech.com', '5566778899', 'user', 4);
INSERT INTO "user" (username, password_hash, email, phone, role, organizationId) VALUES ('testuser', '1234', 'test@example.com', '1234567890', 'user', 1);

-- ## Supplier
INSERT INTO "supplier" (id, name, rating, contact_email, location, phone, historical_ontime_rate, avg_unit_cost, last_response_time, preferred) VALUES (1, 'Alpha Components', 4.5, 'sales@alpha.com', 'Shenzhen, China', '111222333', 0.95, 10.50, 24, true);
INSERT INTO "supplier" (id, name, rating, contact_email, location, phone, historical_ontime_rate, avg_unit_cost, last_response_time, preferred) VALUES (2, 'Beta Electronics', 4.8, 'contact@beta.com', 'Taipei, Taiwan', '444555666', 0.98, 25.00, 12, true);
INSERT INTO "supplier" (id, name, rating, contact_email, location, phone, historical_ontime_rate, avg_unit_cost, last_response_time, preferred) VALUES (3, 'Gamma Mechanical', 4.2, 'info@gamma.com', 'Stuttgart, Germany', '777888999', 0.90, 55.75, 48, false);
INSERT INTO "supplier" (id, name, rating, contact_email, location, phone, historical_ontime_rate, avg_unit_cost, last_response_time, preferred) VALUES (4, 'Delta Materials', 4.0, 'support@delta.com', 'Mumbai, India', '123123123', 0.88, 5.20, 72, false);

-- ## Warehouse
INSERT INTO "warehouse" (id, name, location, organizationId) VALUES (1, 'Main Warehouse Toronto', 'Toronto, ON', 1);
INSERT INTO "warehouse" (id, name, location, organizationId) VALUES (2, 'Innovate Hub West', 'Vancouver, BC', 2);
INSERT INTO "warehouse" (id, name, location, organizationId) VALUES (3, 'Global Distribution East', 'Montreal, QC', 3);
INSERT INTO "warehouse" (id, name, location, organizationId) VALUES (4, 'Future Tech Storage', 'Calgary, AB', 4);

-- ## Component
INSERT INTO "component" (id, num, description, notes, supplier_part_number, supplierId) VALUES (1, 'CMP-001-RES', 'Resistor 10k Ohm 1/4W', 'Standard resistor', 'ALPHA-RES-10K', 1);
INSERT INTO "component" (id, num, description, notes, supplier_part_number, supplierId) VALUES (2, 'CMP-002-CAP', 'Capacitor 100uF 16V', 'Electrolytic capacitor', 'BETA-CAP-100U', 2);
INSERT INTO "component" (id, num, description, notes, supplier_part_number, supplierId) VALUES (3, 'CMP-003-BOLT', 'M3 Bolt 10mm Steel', 'Machine bolt', 'GAMMA-BLT-M3', 3);
INSERT INTO "component" (id, num, description, notes, supplier_part_number, supplierId) VALUES (4, 'CMP-004-CASE', 'Plastic Enclosure Small', 'ABS Plastic', 'DELTA-CSE-S', 4);
INSERT INTO "component" (id, num, description, notes, supplier_part_number, supplierId) VALUES (5, 'CMP-005-CPU', 'Microcontroller ARM M4', 'Main processing unit', 'BETA-CPU-M4', 2);

-- ## Product
INSERT INTO "product" (id, name, description, qty, notes, organizationId) VALUES (1, 'Smart Thermostat V1', 'WiFi enabled thermostat', 150, 'Initial batch', 1);
INSERT INTO "product" (id, name, description, qty, notes, organizationId) VALUES (2, 'IoT Sensor Node', 'Multi-sensor platform', 300, 'For industrial use', 2);
INSERT INTO "product" (id, name, description, qty, notes, organizationId) VALUES (3, 'Precision Gearbox', 'High-torque gearbox', 50, 'Requires special handling', 3);
INSERT INTO "product" (id, name, description, qty, notes, organizationId) VALUES (4, 'Advanced Drone Kit', 'DIY Drone assembly kit', 100, 'Includes all parts', 4);

-- ## BOM (Bill of Materials)
INSERT INTO "bom" (id, productId, componentId, required_qty) VALUES (1, 1, 1, 10); -- Thermostat needs 10 Resistors
INSERT INTO "bom" (id, productId, componentId, required_qty) VALUES (2, 1, 2, 5);  -- Thermostat needs 5 Capacitors
INSERT INTO "bom" (id, productId, componentId, required_qty) VALUES (3, 1, 4, 1);  -- Thermostat needs 1 Case
INSERT INTO "bom" (id, productId, componentId, required_qty) VALUES (4, 1, 5, 1);  -- Thermostat needs 1 CPU
INSERT INTO "bom" (id, productId, componentId, required_qty) VALUES (5, 2, 5, 1);  -- IoT Node needs 1 CPU
INSERT INTO "bom" (id, productId, componentId, required_qty) VALUES (6, 2, 1, 8);  -- IoT Node needs 8 Resistors
INSERT INTO "bom" (id, productId, componentId, required_qty) VALUES (7, 3, 3, 20); -- Gearbox needs 20 Bolts
INSERT INTO "bom" (id, productId, componentId, required_qty) VALUES (8, 4, 3, 15); -- Drone needs 15 Bolts

-- ## WarehouseInventory
INSERT INTO "warehouse_inventory" (id, warehouseId, componentId, current_qty, incoming_qty, outgoing_qty) VALUES (1, 1, 1, 10000, 5000, 500);
INSERT INTO "warehouse_inventory" (id, warehouseId, componentId, current_qty, incoming_qty, outgoing_qty) VALUES (2, 1, 2, 5000, 2000, 200);
INSERT INTO "warehouse_inventory" (id, warehouseId, componentId, current_qty, incoming_qty, outgoing_qty) VALUES (3, 2, 3, 8000, 0, 1000);
INSERT INTO "warehouse_inventory" (id, warehouseId, componentId, current_qty, incoming_qty, outgoing_qty) VALUES (4, 3, 4, 2000, 1000, 150);
INSERT INTO "warehouse_inventory" (id, warehouseId, componentId, current_qty, incoming_qty, outgoing_qty) VALUES (5, 4, 5, 500, 500, 50);

-- ## PurchaseOrder
INSERT INTO "purchase_order" (id, supplierId, created_byId, status, date_created, date_expected) VALUES (1, 1, 1, 'Ordered', '2025-04-15', '2025-06-15');
INSERT INTO "purchase_order" (id, supplierId, created_byId, status, date_created, date_expected) VALUES (2, 2, 2, 'Draft', '2025-05-01', '2025-07-01');
INSERT INTO "purchase_order" (id, supplierId, created_byId, status, date_created, date_expected, date_received) VALUES (3, 3, 3, 'Received', '2025-03-10', '2025-05-10', '2025-05-08');
INSERT INTO "purchase_order" (id, supplierId, created_byId, status, date_created, date_expected) VALUES (4, 2, 1, 'Ordered', '2025-05-20', '2025-08-20');

-- ## POItem
INSERT INTO "po_item" (id, poId, componentId, ordered_qty, received_qty, unit_cost) VALUES (1, 1, 1, 5000, 0, 0.05);
INSERT INTO "po_item" (id, poId, componentId, ordered_qty, received_qty, unit_cost) VALUES (2, 2, 2, 2000, 0, 0.15);
INSERT INTO "po_item" (id, poId, componentId, ordered_qty, received_qty, unit_cost) VALUES (3, 3, 3, 3000, 3000, 0.25);
INSERT INTO "po_item" (id, poId, componentId, ordered_qty, received_qty, unit_cost) VALUES (4, 4, 5, 500, 0, 15.75);
INSERT INTO "po_item" (id, poId, componentId, ordered_qty, received_qty, unit_cost) VALUES (5, 4, 2, 1000, 0, 0.14);

-- ## ShippingInfo
INSERT INTO "shipping_info" (id, poId, componentId, qty, origin, destination, carrier, tracking_number, estimated_arrival, status) VALUES (1, 1, 1, 5000, 'Shenzhen', 'Toronto', 'DHL', 'DHL12345ABC', '2025-06-14', 'In Transit');
INSERT INTO "shipping_info" (id, poId, componentId, qty, origin, destination, carrier, tracking_number, estimated_arrival, status) VALUES (2, 3, 3, 3000, 'Stuttgart', 'Montreal', 'FedEx', 'FDX67890XYZ', '2025-05-08', 'Delivered');
INSERT INTO "shipping_info" (id, poId, componentId, qty, origin, destination, carrier, tracking_number, estimated_arrival, status) VALUES (3, 4, 5, 500, 'Taipei', 'Toronto', 'UPS', 'UPS112233DEF', '2025-08-18', 'Processing');
INSERT INTO "shipping_info" (id, poId, componentId, qty, origin, destination, carrier, tracking_number, estimated_arrival, status) VALUES (4, 4, 2, 1000, 'Taipei', 'Toronto', 'UPS', 'UPS112233DEF', '2025-08-18', 'Processing'); -- Part of same shipment

-- ## SupplierQuote
INSERT INTO "supplier_quote" (id, supplierId, componentId, price_per_unit, currency, valid_until, lead_time_days) VALUES (1, 1, 1, 0.045, 'USD', '2025-12-31', 30);
INSERT INTO "supplier_quote" (id, supplierId, componentId, price_per_unit, currency, valid_until, lead_time_days) VALUES (2, 2, 2, 0.13, 'USD', '2025-12-31', 45);
INSERT INTO "supplier_quote" (id, supplierId, componentId, price_per_unit, currency, valid_until, lead_time_days) VALUES (3, 3, 3, 0.22, 'EUR', '2026-06-30', 60);
INSERT INTO "supplier_quote" (id, supplierId, componentId, price_per_unit, currency, valid_until, lead_time_days) VALUES (4, 2, 5, 15.50, 'USD', '2025-09-30', 50);

-- ## ProductDemand
INSERT INTO "product_demand" (id, productId, month, year, qty, is_forecast) VALUES (1, 1, 6, 2025, 100, false);
INSERT INTO "product_demand" (id, productId, month, year, qty, is_forecast) VALUES (2, 1, 7, 2025, 120, true);
INSERT INTO "product_demand" (id, productId, month, year, qty, is_forecast) VALUES (3, 2, 6, 2025, 250, false);
INSERT INTO "product_demand" (id, productId, month, year, qty, is_forecast) VALUES (4, 2, 7, 2025, 280, true);

-- ## ComponentDemand
INSERT INTO "component_demand" (id, componentId, month, year, qty, is_forecast) VALUES (1, 1, 6, 2025, 1000, false); -- 100 * 10
INSERT INTO "component_demand" (id, componentId, month, year, qty, is_forecast) VALUES (2, 1, 7, 2025, 1200, true);  -- 120 * 10
INSERT INTO "component_demand" (id, componentId, month, year, qty, is_forecast) VALUES (3, 5, 6, 2025, 350, false); -- (100 * 1) + (250 * 1)
INSERT INTO "component_demand" (id, componentId, month, year, qty, is_forecast) VALUES (4, 5, 7, 2025, 400, true);  -- (120 * 1) + (280 * 1)

-- ## AISuggestion
INSERT INTO "ai_suggestion" (id, type, target_id, suggested_value, confidence_score, timestamp, triggered_byId) VALUES (1, 'reorder_point', 1, '8000', 0.85, '2025-05-21 10:00:00', 2);
INSERT INTO "ai_suggestion" (id, type, target_id, suggested_value, confidence_score, timestamp, triggered_byId) VALUES (2, 'shipment_delay', 1, 'Potential 3 day delay on PO #1', 0.92, '2025-05-22 11:00:00', NULL);
INSERT INTO "ai_suggestion" (id, type, target_id, suggested_value, confidence_score, timestamp, triggered_byId) VALUES (3, 'supplier_choice', 4, 'Suggest using Beta Electronics (ID 2)', 0.78, '2025-05-23 12:00:00', 2);
INSERT INTO "ai_suggestion" (id, type, target_id, suggested_value, confidence_score, timestamp, triggered_byId) VALUES (4, 'inventory_transfer', 3, 'Move 1000 units from WH2 to WH1', 0.88, '2025-05-24 13:00:00', NULL);

-- ## ChatMessage
INSERT INTO "chat_message" (id, senderId, receiverId, poId, message_body, timestamp) VALUES (1, 1, 2, 1, 'Can we get an update on PO #1?', '2025-05-20 09:30:00');
INSERT INTO "chat_message" (id, senderId, receiverId, poId, message_body, timestamp) VALUES (2, 2, 1, 1, 'Checking with DHL now, looks like its on track.', '2025-05-20 09:35:00');
INSERT INTO "chat_message" (id, senderId, receiverId, poId, message_body, timestamp) VALUES (3, 3, 4, NULL, 'Please review the specs for the new drone.', '2025-05-21 14:00:00');
INSERT INTO "chat_message" (id, senderId, receiverId, poId, message_body, timestamp) VALUES (4, 4, 3, NULL, 'Looks good, approved.', '2025-05-21 15:30:00');

-- ## MessageAttachment
INSERT INTO "message_attachment" (id, messageId, file_url, file_type) VALUES (1, 3, '/attachments/drone_specs_v2.pdf', 'application/pdf');
INSERT INTO "message_attachment" (id, messageId, file_url, file_type) VALUES (2, 3, '/attachments/drone_image.jpg', 'image/jpeg');
INSERT INTO "message_attachment" (id, messageId, file_url, file_type) VALUES (3, 1, '/attachments/po1_details.txt', 'text/plain');
INSERT INTO "message_attachment" (id, messageId, file_url, file_type) VALUES (4, 4, '/attachments/approval_sig.png', 'image/png');

-- ## POConversationThread
INSERT INTO "po_conversation_thread" (id, poId, title, created_byId, created_at) VALUES (1, 1, 'Follow-up on PO #1 ETA', 1, '2025-05-20 09:29:00');
INSERT INTO "po_conversation_thread" (id, poId, title, created_byId, created_at) VALUES (2, 4, 'Query about CPU specs for PO #4', 1, '2025-05-22 11:15:00');
INSERT INTO "po_conversation_thread" (id, poId, title, created_byId, created_at) VALUES (3, 2, 'Draft review PO #2', 2, '2025-05-02 10:00:00');
INSERT INTO "po_conversation_thread" (id, poId, title, created_byId, created_at) VALUES (4, 3, 'Confirmation of Receipt PO #3', 3, '2025-05-09 16:00:00');

-- ## AuditLog
INSERT INTO "audit_log" (id, entity_type, entity_id, action_type, actorId, timestamp, change_summary) VALUES (1, 'PurchaseOrder', 1, 'create', 1, '2025-04-15 11:05:00', 'Created new PO for Alpha Components');
INSERT INTO "audit_log" (id, entity_type, entity_id, action_type, actorId, timestamp, change_summary) VALUES (2, 'Component', 3, 'update', 2, '2025-04-16 14:20:00', 'Updated notes for CMP-003-BOLT');
INSERT INTO "audit_log" (id, entity_type, entity_id, action_type, actorId, timestamp, change_summary) VALUES (3, 'PurchaseOrder', 3, 'update', 3, '2025-05-08 17:00:00', 'Marked PO #3 as Received');
INSERT INTO "audit_log" (id, entity_type, entity_id, action_type, actorId, timestamp, change_summary) VALUES (4, 'User', 4, 'create', 2, '2025-05-10 09:00:00', 'Created new user staff_ft');


-- ## MonthlyStock
INSERT INTO "monthly_stock" (id, warehouseId, month, year, percent_occupied) VALUES (1, 1, 4, 2025, 65.5);
INSERT INTO "monthly_stock" (id, warehouseId, month, year, percent_occupied) VALUES (2, 1, 5, 2025, 68.0);
INSERT INTO "monthly_stock" (id, warehouseId, month, year, percent_occupied) VALUES (3, 2, 4, 2025, 75.0);
INSERT INTO "monthly_stock" (id, warehouseId, month, year, percent_occupied) VALUES (4, 2, 5, 2025, 72.5);

-- ## WarehouseLayout
INSERT INTO "warehouse_layout" (id, warehouseId, layout_image_url, occupancy_json, percent_occupied) VALUES (1, 1, '/layouts/wh1_v1.png', '{"A1": "CMP-001", "A2": "CMP-002"}', 68.0);
INSERT INTO "warehouse_layout" (id, warehouseId, layout_image_url, occupancy_json, percent_occupied) VALUES (2, 2, '/layouts/wh2_v1.png', '{"R1S1": "CMP-003"}', 72.5);
INSERT INTO "warehouse_layout" (id, warehouseId, layout_image_url, occupancy_json, percent_occupied) VALUES (3, 3, '/layouts/wh3_v1.png', '{"Z1": "CMP-004"}', 55.0);
INSERT INTO "warehouse_layout" (id, warehouseId, layout_image_url, occupancy_json, percent_occupied) VALUES (4, 4, '/layouts/wh4_v1.png', '{"P1": "CMP-005"}', 40.0);