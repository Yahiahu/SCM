-- ## Organization (Adding 3 more)
INSERT INTO organization (id, name) VALUES (5, 'Innovate Solutions ltd');
INSERT INTO organization (id, name) VALUES (3, 'Global Parts Inc.');
INSERT INTO organization (id, name) VALUES (4, 'Future Tech Supplies');
INSERT INTO organization (id, name) VALUES (1, 'Test Org');
INSERT INTO organization (id, name) VALUES (2, 'Innovate Solutions');


-- ## User (Adding 3 more, using existing 'testuser' as ID 1)
INSERT INTO "user" (id, username, password_hash, email, phone, role, "organizationId") VALUES (2, 'admin_user', '5678', 'admin@innovate.com', '0987654321', 'admin', 2);
INSERT INTO "user" (id, username, password_hash, email, phone, role, "organizationId") VALUES (3, 'manager_gp', 'abcd', 'manager@globalparts.com', '1122334455', 'manager', 3);
INSERT INTO "user" (id, username, password_hash, email, phone, role, "organizationId") VALUES (4, 'staff_ft', 'efgh', 'staff@futuretech.com', '5566778899', 'user', 4);
INSERT INTO "user" (username, password_hash, email, phone, role, "organizationId") VALUES ('testuser', '1234', 'test@example.com', '1234567890', 'user', 1);


-- ## Supplier
INSERT INTO "supplier" (id, name, rating, contact_email, location, phone, historical_ontime_rate, avg_unit_cost, last_response_time, preferred) VALUES (1, 'Alpha Components', 4.5, 'sales@alpha.com', 'Shenzhen, China', '111222333', 0.95, 10.50, 24, true);
INSERT INTO "supplier" (id, name, rating, contact_email, location, phone, historical_ontime_rate, avg_unit_cost, last_response_time, preferred) VALUES (2, 'Beta Electronics', 4.8, 'contact@beta.com', 'Taipei, Taiwan', '444555666', 0.98, 25.00, 12, true);
INSERT INTO "supplier" (id, name, rating, contact_email, location, phone, historical_ontime_rate, avg_unit_cost, last_response_time, preferred) VALUES (3, 'Gamma Mechanical', 4.2, 'info@gamma.com', 'Stuttgart, Germany', '777888999', 0.90, 55.75, 48, false);
INSERT INTO "supplier" (id, name, rating, contact_email, location, phone, historical_ontime_rate, avg_unit_cost, last_response_time, preferred) VALUES (4, 'Delta Materials', 4.0, 'support@delta.com', 'Mumbai, India', '123123123', 0.88, 5.20, 72, false);




-- ## Warehouse
INSERT INTO "warehouse" (id, name, location, "organizationId") VALUES (1, 'Main Warehouse Toronto', 'Toronto, ON', 1);
INSERT INTO "warehouse" (id, name, location, "organizationId") VALUES (2, 'Innovate Hub West', 'Vancouver, BC', 2);
INSERT INTO "warehouse" (id, name, location, "organizationId") VALUES (3, 'Global Distribution East', 'Montreal, QC', 3);
INSERT INTO "warehouse" (id, name, location, "organizationId") VALUES (4, 'Future Tech Storage', 'Calgary, AB', 4);




-- ## Component
INSERT INTO "component" (id, num, description, notes, supplier_part_number, "supplierId") VALUES (1, 'CMP-001-RES', 'Resistor 10k Ohm 1/4W', 'Standard resistor', 'ALPHA-RES-10K', 1);
INSERT INTO "component" (id, num, description, notes, supplier_part_number, "supplierId") VALUES (2, 'CMP-002-CAP', 'Capacitor 100uF 16V', 'Electrolytic capacitor', 'BETA-CAP-100U', 2);
INSERT INTO "component" (id, num, description, notes, supplier_part_number, "supplierId") VALUES (3, 'CMP-003-BOLT', 'M3 Bolt 10mm Steel', 'Machine bolt', 'GAMMA-BLT-M3', 3);
INSERT INTO "component" (id, num, description, notes, supplier_part_number, "supplierId") VALUES (4, 'CMP-004-CASE', 'Plastic Enclosure Small', 'ABS Plastic', 'DELTA-CSE-S', 4);
INSERT INTO "component" (id, num, description, notes, supplier_part_number, "supplierId") VALUES (5, 'CMP-005-CPU', 'Microcontroller ARM M4', 'Main processing unit', 'BETA-CPU-M4', 2);


-- ## Product
INSERT INTO "product" (id, name, description, qty, notes, "organizationId") VALUES (1, 'Smart Thermostat V2', 'WiFi enabled thermostat', 150, 'Initial batch', 1);
INSERT INTO "product" (id, name, description, qty, notes, "organizationId") VALUES (2, 'IoT Sensor Node', 'Multi-sensor platform', 300, 'For industrial use', 2);
INSERT INTO "product" (id, name, description, qty, notes, "organizationId") VALUES (3, 'Precision Gearbox', 'High-torque gearbox', 50, 'Requires special handling', 3);
INSERT INTO "product" (id, name, description, qty, notes, "organizationId") VALUES (4, 'Advanced Drone Kit', 'DIY Drone assembly kit', 100, 'Includes all parts', 4);
INSERT INTO "product" (id, name, description, qty, notes, "organizationId") VALUES (5, 'Mickey Mouse wedding ring', 'mickey and miney mouse set', 1, '* wife not included', 4);


-- ## BOM (Bill of Materials)
INSERT INTO "bom" (id, "productId", "componentId", required_qty) VALUES (1, 1, 1, 10); -- Thermostat needs 10 Resistors
INSERT INTO "bom" (id, "productId", "componentId", required_qty) VALUES (2, 1, 2, 5);  -- Thermostat needs 5 Capacitors
INSERT INTO "bom" (id, "productId", "componentId", required_qty) VALUES (3, 1, 4, 1);  -- Thermostat needs 1 Case
INSERT INTO "bom" (id, "productId", "componentId", required_qty) VALUES (4, 1, 5, 1);  -- Thermostat needs 1 CPU
INSERT INTO "bom" (id, "productId", "componentId", required_qty) VALUES (5, 2, 5, 1);  -- IoT Node needs 1 CPU
INSERT INTO "bom" (id, "productId", "componentId", required_qty) VALUES (6, 2, 1, 8);  -- IoT Node needs 8 Resistors
INSERT INTO "bom" (id, "productId", "componentId", required_qty) VALUES (7, 3, 3, 20); -- Gearbox needs 20 Bolts
INSERT INTO "bom" (id, "productId", "componentId", required_qty) VALUES (8, 4, 3, 15); -- Drone needs 15 Bolts




-- ## WarehouseInventory
INSERT INTO "warehouse_inventory" (id, "warehouseId", "componentId", current_qty, incoming_qty, outgoing_qty) VALUES (1, 1, 1, 10000, 5000, 500);
INSERT INTO "warehouse_inventory" (id, "warehouseId", "componentId", current_qty, incoming_qty, outgoing_qty) VALUES (2, 1, 2, 5000, 2000, 200);
INSERT INTO "warehouse_inventory" (id, "warehouseId", "componentId", current_qty, incoming_qty, outgoing_qty) VALUES (3, 2, 3, 8000, 0, 1000);
INSERT INTO "warehouse_inventory" (id, "warehouseId", "componentId", current_qty, incoming_qty, outgoing_qty) VALUES (4, 3, 4, 2000, 1000, 150);
INSERT INTO "warehouse_inventory" (id, "warehouseId", "componentId", current_qty, incoming_qty, outgoing_qty) VALUES (5, 4, 5, 500, 500, 50);


-- ## PurchaseOrder
INSERT INTO "purchase_order" (id, "supplierId", "createdById", status, date_created, date_expected) VALUES (1, 1, 1, 'Ordered', '2025-04-15', '2025-06-15');
INSERT INTO "purchase_order" (id, "supplierId", "createdById", status, date_created, date_expected) VALUES (2, 2, 2, 'Draft', '2025-05-01', '2025-07-01');
INSERT INTO "purchase_order" (id, "supplierId", "createdById", status, date_created, date_expected, date_received) VALUES (3, 3, 3, 'Received', '2025-03-10', '2025-05-10', '2025-05-08');
INSERT INTO "purchase_order" (id, "supplierId", "createdById", status, date_created, date_expected) VALUES (4, 2, 1, 'Ordered', '2025-05-20', '2025-08-20');




-- ## POItem
INSERT INTO "po_item" (id, "poId", "componentId", ordered_qty, received_qty, unit_cost) VALUES (1, 1, 1, 5000, 0, 0.05);
INSERT INTO "po_item" (id, "poId", "componentId", ordered_qty, received_qty, unit_cost) VALUES (2, 2, 2, 2000, 0, 0.15);
INSERT INTO "po_item" (id, "poId", "componentId", ordered_qty, received_qty, unit_cost) VALUES (3, 3, 3, 3000, 3000, 0.25);
INSERT INTO "po_item" (id, "poId", "componentId", ordered_qty, received_qty, unit_cost) VALUES (4, 4, 5, 500, 0, 15.75);
INSERT INTO "po_item" (id, "poId", "componentId", ordered_qty, received_qty, unit_cost) VALUES (5, 4, 2, 1000, 0, 0.14);


-- ## ShippingInfo
INSERT INTO "shipping_info" (id, "poId", "componentId", qty, origin, destination, carrier, tracking_number, estimated_arrival, status) VALUES (1, 1, 1, 5000, 'Shenzhen', 'Toronto', 'DHL', 'DHL12345ABC', '2025-06-14', 'In Transit');
INSERT INTO "shipping_info" (id, "poId", "componentId", qty, origin, destination, carrier, tracking_number, estimated_arrival, status) VALUES (2, 3, 3, 3000, 'Stuttgart', 'Montreal', 'FedEx', 'FDX67890XYZ', '2025-05-08', 'Delivered');
INSERT INTO "shipping_info" (id, "poId", "componentId", qty, origin, destination, carrier, tracking_number, estimated_arrival, status) VALUES (3, 4, 5, 500, 'Taipei', 'Toronto', 'UPS', 'UPS112233DEF', '2025-08-18', 'Processing');
INSERT INTO "shipping_info" (id, "poId", "componentId", qty, origin, destination, carrier, tracking_number, estimated_arrival, status) VALUES (4, 4, 2, 1000, 'Taipei', 'Toronto', 'UPS', 'UPS112233DEF', '2025-08-18', 'Processing'); -- Part of same shipment




-- ## SupplierQuote
INSERT INTO "supplier_quote" (id, "supplierId", "componentId", price_per_unit, currency, valid_until, lead_time_days) VALUES (1, 1, 1, 0.045, 'USD', '2025-12-31', 30);
INSERT INTO "supplier_quote" (id, "supplierId", "componentId", price_per_unit, currency, valid_until, lead_time_days) VALUES (2, 2, 2, 0.13, 'USD', '2025-12-31', 45);
INSERT INTO "supplier_quote" (id, "supplierId", "componentId", price_per_unit, currency, valid_until, lead_time_days) VALUES (3, 3, 3, 0.22, 'EUR', '2026-06-30', 60);
INSERT INTO "supplier_quote" (id, "supplierId", "componentId", price_per_unit, currency, valid_until, lead_time_days) VALUES (4, 2, 5, 15.50, 'USD', '2025-09-30', 50);




-- ## ProductDemand
INSERT INTO "product_demand" (id, "productId", month, year, qty, is_forecast) VALUES (1, 1, 6, 2025, 100, false);
INSERT INTO "product_demand" (id, "productId", month, year, qty, is_forecast) VALUES (2, 1, 7, 2025, 120, true);
INSERT INTO "product_demand" (id, "productId", month, year, qty, is_forecast) VALUES (3, 2, 6, 2025, 250, false);
INSERT INTO "product_demand" (id, "productId", month, year, qty, is_forecast) VALUES (4, 2, 7, 2025, 280, true);




-- ## ComponentDemand
INSERT INTO "component_demand" (id, "componentId", month, year, qty, is_forecast) VALUES (1, 1, 6, 2025, 1000, false); -- 100 * 10
INSERT INTO "component_demand" (id, "componentId", month, year, qty, is_forecast) VALUES (2, 1, 7, 2025, 1200, true);  -- 120 * 10
INSERT INTO "component_demand" (id, "componentId", month, year, qty, is_forecast) VALUES (3, 5, 6, 2025, 350, false); -- (100 * 1) + (250 * 1)
INSERT INTO "component_demand" (id, "componentId", month, year, qty, is_forecast) VALUES (4, 5, 7, 2025, 400, true);  -- (120 * 1) + (280 * 1)




-- ## ChatMessage
INSERT INTO "chat_message" (id, "senderId", "receiverId", "poId", message_body, timestamp) VALUES (1, 1, 2, 1, 'Can we get an update on PO #1?', '2025-05-20 09:30:00');
INSERT INTO "chat_message" (id, "senderId", "receiverId", "poId", message_body, timestamp) VALUES (2, 2, 1, 1, 'Checking with DHL now, looks like its on track.', '2025-05-20 09:35:00');
INSERT INTO "chat_message" (id, "senderId", "receiverId", "poId", message_body, timestamp) VALUES (3, 3, 4, NULL, 'Please review the specs for the new drone.', '2025-05-21 14:00:00');
INSERT INTO "chat_message" (id, "senderId", "receiverId", "poId", message_body, timestamp) VALUES (4, 4, 3, NULL, 'Looks good, approved.', '2025-05-21 15:30:00');




-- ## MessageAttachment
INSERT INTO "message_attachment" (id, "messageId", file_url, file_type) VALUES (1, 3, '/attachments/drone_specs_v2.pdf', 'application/pdf');
INSERT INTO "message_attachment" (id, "messageId", file_url, file_type) VALUES (2, 3, '/attachments/drone_image.jpg', 'image/jpeg');
INSERT INTO "message_attachment" (id, "messageId", file_url, file_type) VALUES (3, 1, '/attachments/po1_details.txt', 'text/plain');
INSERT INTO "message_attachment" (id, "messageId", file_url, file_type) VALUES (4, 4, '/attachments/approval_sig.png', 'image/png');




-- ## POConversationThread
INSERT INTO "po_conversation_thread" (id, "poId", title, "createdById", created_at) VALUES (1, 1, 'Follow-up on PO #1 ETA', 1, '2025-05-20 09:29:00');
INSERT INTO "po_conversation_thread" (id, "poId", title, "createdById", created_at) VALUES (2, 4, 'Query about CPU specs for PO #4', 1, '2025-05-22 11:15:00');
INSERT INTO "po_conversation_thread" (id, "poId", title, "createdById", created_at) VALUES (3, 2, 'Draft review PO #2', 2, '2025-05-02 10:00:00');
INSERT INTO "po_conversation_thread" (id, "poId", title, "createdById", created_at) VALUES (4, 3, 'Confirmation of Receipt PO #3', 3, '2025-05-09 16:00:00');


-- ## AuditLog
INSERT INTO "audit_log" (id, entity_type, "entity_id", action_type, "actorId", timestamp, change_summary) VALUES (1, 'PurchaseOrder', 1, 'create', 1, '2025-04-15 11:05:00', 'Created new PO for Alpha Components');
INSERT INTO "audit_log" (id, entity_type, "entity_id", action_type, "actorId", timestamp, change_summary) VALUES (2, 'Component', 3, 'update', 2, '2025-04-16 14:20:00', 'Updated notes for CMP-003-BOLT');
INSERT INTO "audit_log" (id, entity_type, "entity_id", action_type, "actorId", timestamp, change_summary) VALUES (3, 'PurchaseOrder', 3, 'update', 3, '2025-05-08 17:00:00', 'Marked PO #3 as Received');
INSERT INTO "audit_log" (id, entity_type, "entity_id", action_type, "actorId", timestamp, change_summary) VALUES (4, 'User', 4, 'create', 2, '2025-05-10 09:00:00', 'Created new user staff_ft');


-- ## MonthlyStock
INSERT INTO "monthly_stock" (id, "warehouseId", month, year, percent_occupied) VALUES (1, 1, 4, 2025, 65.5);
INSERT INTO "monthly_stock" (id, "warehouseId", month, year, percent_occupied) VALUES (2, 1, 5, 2025, 68.0);
INSERT INTO "monthly_stock" (id, "warehouseId", month, year, percent_occupied) VALUES (3, 2, 4, 2025, 75.0);
INSERT INTO "monthly_stock" (id, "warehouseId", month, year, percent_occupied) VALUES (4, 2, 5, 2025, 72.5);


-- ## WarehouseLayout
INSERT INTO "warehouse_layout" (id, "warehouseId", layout_image_url, occupancy_json, percent_occupied) VALUES (1, 1, '/layouts/wh1_v1.png', '{"A1": "CMP-001", "A2": "CMP-002"}', 68.0);
INSERT INTO "warehouse_layout" (id, "warehouseId", layout_image_url, occupancy_json, percent_occupied) VALUES (2, 2, '/layouts/wh2_v1.png', '{"R1S1": "CMP-003"}', 72.5);
INSERT INTO "warehouse_layout" (id, "warehouseId", layout_image_url, occupancy_json, percent_occupied) VALUES (3, 3, '/layouts/wh3_v1.png', '{"Z1": "CMP-004"}', 55.0);
INSERT INTO "warehouse_layout" (id, "warehouseId", layout_image_url, occupancy_json, percent_occupied) VALUES (4, 4, '/layouts/wh4_v1.png', '{"P1": "CMP-005"}', 40.0);


-- ## New
-- ## AnomalyLog (sample)
INSERT INTO anomaly_log (id, entity_type, entity_id, description, severity_score, detected_by, "reviewerId", timestamp) VALUES (1, 'Component', 2, 'Voltage irregularity detected in capacitor', 7.5, 'SystemAuto', 2, '2025-06-01 12:00:00');
INSERT INTO anomaly_log (id, entity_type, entity_id, description, severity_score, detected_by, "reviewerId", timestamp) VALUES (2, 'PurchaseOrder', 1, 'Unusual delay in shipment for PO #1', 8.2, 'SystemAuto', 1, '2025-06-02 10:00:00');
INSERT INTO anomaly_log (id, entity_type, entity_id, description, severity_score, detected_by, "reviewerId", timestamp) VALUES (3, 'InventoryBatch', 1, 'Higher than expected spoilage rate in batch BATCH-001', 6.0, 'SystemAuto', 3, '2025-06-03 09:15:00');
INSERT INTO anomaly_log (id, entity_type, entity_id, description, severity_score, detected_by, "reviewerId", timestamp) VALUES (4, 'Supplier', 4, 'Sudden drop in Delta Materials historical on-time rate', 7.0, 'SystemAuto', 2, '2025-06-04 14:30:00');
INSERT INTO anomaly_log (id, entity_type, entity_id, description, severity_score, detected_by, "reviewerId", timestamp) VALUES (5, 'Product', 1, 'Unexpected surge in demand for Smart Thermostat V2', 7.8, 'SystemAuto', 1, '2025-06-05 11:00:00');

-- ## AutomationRule
INSERT INTO automation_rule (id, name, trigger_event, target_entity_type, target_entity_id, action_definition, is_active, "createdById", created_at) VALUES (1, 'Notify Admin on High Severity Anomaly', 'anomaly_detected', 'Component', 2, '{"action":"notify","target":"admin"}', true, 2, '2025-06-01 13:00:00');
INSERT INTO automation_rule (id, name, trigger_event, target_entity_type, target_entity_id, action_definition, is_active, "createdById", created_at) VALUES (2, 'Auto-Create Task for PO Delay', 'purchase_order_delay', 'PurchaseOrder', 1, '{"action":"create_task","task_title":"Follow up on PO delay"}', true, 1, '2025-06-02 10:05:00');
INSERT INTO automation_rule (id, name, trigger_event, target_entity_type, target_entity_id, action_definition, is_active, "createdById", created_at) VALUES (3, 'Generate RFQ for Low Stock Component', 'low_stock_threshold', 'Component', 3, '{"action":"generate_rfq","threshold":100}', true, 3, '2025-06-03 16:00:00');
INSERT INTO automation_rule (id, name, trigger_event, target_entity_type, target_entity_id, action_definition, is_active, "createdById", created_at) VALUES (4, 'Update Product Qty on New Shipment', 'shipment_received', 'Product', NULL, '{"action":"update_product_qty"}', true, 2, '2025-06-04 09:00:00');
INSERT INTO automation_rule (id, name, trigger_event, target_entity_type, target_entity_id, action_definition, is_active, "createdById", created_at) VALUES (5, 'Alert on Supplier Rating Drop', 'supplier_rating_change', 'Supplier', 4, '{"action":"send_email","recipient":"purchasing_manager"}', true, 1, '2025-06-04 14:45:00');

-- ## BinLocation
INSERT INTO bin_location (id, label, description, zone, "warehouseId") VALUES (1, 'A1', 'Standard bin', 'Zone 1', 1);
INSERT INTO bin_location (id, label, description, zone, "warehouseId") VALUES (2, 'B3', 'Oversized storage', 'Zone 2', 1);
INSERT INTO bin_location (id, label, description, zone, "warehouseId") VALUES (3, 'C7', 'Temperature controlled', 'Zone 1', 2);
INSERT INTO bin_location (id, label, description, zone, "warehouseId") VALUES (4, 'D2', 'Hazardous materials', 'Zone 3', 3);
INSERT INTO bin_location (id, label, description, zone, "warehouseId") VALUES (5, 'E5', 'Electronics storage', 'Zone 2', 4);

-- ## Goal
INSERT INTO goal (id, name, kpi_metric, target_value, description, unit, due_date, is_active, "organizationId", "createdById") VALUES (1, 'On-Time Delivery Rate', 'on_time_delivery', 95, 'Ensure 95% on-time delivery', '%', '2025-12-31', true, 1, 1);
INSERT INTO goal (id, name, kpi_metric, target_value, description, unit, due_date, is_active, "organizationId", "createdById") VALUES (2, 'Reduce Inventory Holding Cost', 'inventory_holding_cost', 10, 'Decrease holding cost by 10%', '%', '2025-12-31', true, 2, 2);
INSERT INTO goal (id, name, kpi_metric, target_value, description, unit, due_date, is_active, "organizationId", "createdById") VALUES (3, 'Supplier Quality Improvement', 'supplier_quality_score', 4.5, 'Achieve average supplier quality of 4.5', 'score', '2025-09-30', true, 3, 3);
INSERT INTO goal (id, name, kpi_metric, target_value, description, unit, due_date, is_active, "organizationId", "createdById") VALUES (4, 'Warehouse Space Utilization', 'percent_occupied', 80, 'Maximize warehouse occupancy to 80%', '%', '2025-12-31', true, 4, 4);
INSERT INTO goal (id, name, kpi_metric, target_value, description, unit, due_date, is_active, "organizationId", "createdById") VALUES (5, 'Improve Forecast Accuracy', 'forecast_accuracy', 90, 'Achieve 90% accuracy for demand forecasts', '%', '2025-12-31', true, 1, 1);

-- ## InventoryAudit
INSERT INTO inventory_audit (id, "warehouseId", "componentId", recorded_qty, counted_qty, notes, "conductedById", audit_date) VALUES (1, 1, 1, 10000, 9950, 'Discrepancy noted', 1, '2025-06-01');
INSERT INTO inventory_audit (id, "warehouseId", "componentId", recorded_qty, counted_qty, notes, "conductedById", audit_date) VALUES (2, 1, 2, 5000, 4980, 'Minor variance', 1, '2025-06-01');
INSERT INTO inventory_audit (id, "warehouseId", "componentId", recorded_qty, counted_qty, notes, "conductedById", audit_date) VALUES (3, 2, 3, 8000, 8000, 'No discrepancy', 2, '2025-06-02');
INSERT INTO inventory_audit (id, "warehouseId", "componentId", recorded_qty, counted_qty, notes, "conductedById", audit_date) VALUES (4, 3, 4, 2000, 1990, 'Missing 10 units', 3, '2025-06-03');
INSERT INTO inventory_audit (id, "warehouseId", "componentId", recorded_qty, counted_qty, notes, "conductedById", audit_date) VALUES (5, 4, 5, 500, 495, 'Small shortage', 4, '2025-06-04');

-- ## InventoryBatch
INSERT INTO inventory_batch (id, batch_number, "componentId", "warehouseId", qty, received_date, expiry_date, supplier_lot_ref, notes) VALUES (1, 'BATCH-001', 1, 1, 5000, '2025-05-01', '2026-05-01', 'SLR-123', 'Initial batch received');
INSERT INTO inventory_batch (id, batch_number, "componentId", "warehouseId", qty, received_date, expiry_date, supplier_lot_ref, notes) VALUES (2, 'BATCH-002', 2, 1, 2000, '2025-05-10', '2026-05-10', 'SLR-456', 'Second batch');
INSERT INTO inventory_batch (id, batch_number, "componentId", "warehouseId", qty, received_date, expiry_date, supplier_lot_ref, notes) VALUES (3, 'BATCH-003', 3, 2, 3000, '2025-05-15', NULL, 'SLR-789', 'Non-expiring part');
INSERT INTO inventory_batch (id, batch_number, "componentId", "warehouseId", qty, received_date, expiry_date, supplier_lot_ref, notes) VALUES (4, 'BATCH-004', 4, 3, 1000, '2025-05-20', '2027-05-20', 'SLR-ABC', 'New supplier lot');
INSERT INTO inventory_batch (id, batch_number, "componentId", "warehouseId", qty, received_date, expiry_date, supplier_lot_ref, notes) VALUES (5, 'BATCH-005', 5, 4, 500, '2025-05-25', '2026-11-25', 'SLR-DEF', 'Critical component batch');

-- ## InventoryTransaction
INSERT INTO inventory_transaction (id, "componentId", "warehouseId", type, quantity, reference, notes, "performedById", timestamp) VALUES (1, 1, 1, 'in', 5000, 'PO#1', 'Received via PO', 1, '2025-05-01 09:00:00');
INSERT INTO inventory_transaction (id, "componentId", "warehouseId", type, quantity, reference, notes, "performedById", timestamp) VALUES (2, 2, 1, 'in', 2000, 'PO#2', 'Received via PO', 1, '2025-05-10 10:30:00');
INSERT INTO inventory_transaction (id, "componentId", "warehouseId", type, quantity, reference, notes, "performedById", timestamp) VALUES (3, 3, 2, 'out', 1000, 'SO#123', 'Shipped for production', 2, '2025-05-20 14:00:00');
INSERT INTO inventory_transaction (id, "componentId", "warehouseId", type, quantity, reference, notes, "performedById", timestamp) VALUES (4, 4, 3, 'in', 1000, 'PO#3', 'Received via PO', 3, '2025-05-25 11:45:00');
INSERT INTO inventory_transaction (id, "componentId", "warehouseId", type, quantity, reference, notes, "performedById", timestamp) VALUES (5, 5, 4, 'out', 50, 'ProdOrder#001', 'Used in product assembly', 4, '2025-05-28 08:00:00');

-- ## InventoryValuation
INSERT INTO inventory_valuation (id, "componentId", "warehouseId", quantity, unit_cost, total_value, valuation_method, valuation_date) VALUES (1, 1, 1, 5000, 0.05, 250.0, 'FIFO', '2025-06-01');
INSERT INTO inventory_valuation (id, "componentId", "warehouseId", quantity, unit_cost, total_value, valuation_method, valuation_date) VALUES (2, 2, 1, 2000, 0.15, 300.0, 'FIFO', '2025-06-01');
INSERT INTO inventory_valuation (id, "componentId", "warehouseId", quantity, unit_cost, total_value, valuation_method, valuation_date) VALUES (3, 3, 2, 7000, 0.25, 1750.0, 'Weighted Average', '2025-06-01');
INSERT INTO inventory_valuation (id, "componentId", "warehouseId", quantity, unit_cost, total_value, valuation_method, valuation_date) VALUES (4, 4, 3, 2000, 0.06, 120.0, 'LIFO', '2025-06-01');
INSERT INTO inventory_valuation (id, "componentId", "warehouseId", quantity, unit_cost, total_value, valuation_method, valuation_date) VALUES (5, 5, 4, 450, 15.75, 7087.50, 'FIFO', '2025-06-01');

-- ## LandedCost
INSERT INTO landed_cost (id, "componentId", "purchaseOrderId", "shipmentId", base_unit_cost, freight_cost, duty_cost, handling_cost, total_unit_cost, notes, recorded_at) VALUES (1, 1, 1, 1, 0.045, 0.01, 0.005, 0.002, 0.062, 'Includes all associated fees', '2025-06-01');
INSERT INTO landed_cost (id, "componentId", "purchaseOrderId", "shipmentId", base_unit_cost, freight_cost, duty_cost, handling_cost, total_unit_cost, notes, recorded_at) VALUES (2, 2, 2, NULL, 0.13, 0.02, 0.01, 0.005, 0.165, 'Estimated landed cost for PO #2', '2025-06-02');
INSERT INTO landed_cost (id, "componentId", "purchaseOrderId", "shipmentId", base_unit_cost, freight_cost, duty_cost, handling_cost, total_unit_cost, notes, recorded_at) VALUES (3, 3, 3, 2, 0.22, 0.03, 0.015, 0.007, 0.272, 'Actual landed cost for received PO #3', '2025-06-03');
INSERT INTO landed_cost (id, "componentId", "purchaseOrderId", "shipmentId", base_unit_cost, freight_cost, duty_cost, handling_cost, total_unit_cost, notes, recorded_at) VALUES (4, 5, 4, 3, 15.50, 2.00, 1.50, 0.75, 19.75, 'Landed cost for high-value CPU', '2025-06-04');
INSERT INTO landed_cost (id, "componentId", "purchaseOrderId", "shipmentId", base_unit_cost, freight_cost, duty_cost, handling_cost, total_unit_cost, notes, recorded_at) VALUES (5, 2, 4, 4, 0.14, 0.018, 0.008, 0.003, 0.169, 'Landed cost for additional capacitors on PO #4', '2025-06-04');

-- ## PurchaseGroup
INSERT INTO purchase_group (id, name, notes, created_at) VALUES (1, 'May Consolidated Orders', 'Grouped POs for May bulk shipment', '2025-06-01');
INSERT INTO purchase_group (id, name, notes, created_at) VALUES (2, 'Q3 Electronics Buy', 'Strategic purchase for Q3 electronics components', '2025-05-25');
INSERT INTO purchase_group (id, name, notes, created_at) VALUES (3, 'Urgent Mechanical Parts', 'Expedited orders for critical mechanical components', '2025-05-28');
INSERT INTO purchase_group (id, name, notes, created_at) VALUES (4, 'Asia Pacific Sourcing', 'POs from suppliers in Asia Pacific region', '2025-05-30');
INSERT INTO purchase_group (id, name, notes, created_at) VALUES (5, 'Annual Resistor Replenishment', 'Bulk order for standard resistors', '2025-06-01');

-- ## ReturnOrder
INSERT INTO return_order (id, "purchaseOrderId", reason, created_at) VALUES (1, 2, 'Defective capacitors', '2025-06-01');
INSERT INTO return_order (id, "purchaseOrderId", reason, created_at) VALUES (2, 3, 'Incorrect quantity received', '2025-06-02');
INSERT INTO return_order (id, "purchaseOrderId", reason, created_at) VALUES (3, 1, 'Damaged during transit', '2025-06-03');
INSERT INTO return_order (id, "purchaseOrderId", reason, created_at) VALUES (4, 4, 'Changed order requirements', '2025-06-04');
INSERT INTO return_order (id, "purchaseOrderId", reason, created_at) VALUES (5, 1, 'Supplier error', '2025-06-05');

-- ## ReturnOrderItem
INSERT INTO return_order_item (id, "returnOrderId", "componentId", qty, reason) VALUES (1, 1, 2, 100, 'Leaking on arrival');
INSERT INTO return_order_item (id, "returnOrderId", "componentId", qty, reason) VALUES (2, 2, 3, 50, 'Received 3050, ordered 3000');
INSERT INTO return_order_item (id, "returnOrderId", "componentId", qty, reason) VALUES (3, 3, 1, 200, 'Visibly crushed packaging');
INSERT INTO return_order_item (id, "returnOrderId", "componentId", qty, reason) VALUES (4, 4, 5, 20, 'No longer required due to design change');
INSERT INTO return_order_item (id, "returnOrderId", "componentId", qty, reason) VALUES (5, 5, 1, 50, 'Wrong part shipped by supplier');

-- ## RFQ
INSERT INTO rfq (id, "supplierId", notes, created_at) VALUES (1, 2, 'Requesting updated quote for CPUs', '2025-06-01');
INSERT INTO rfq (id, "supplierId", notes, created_at) VALUES (2, 1, 'New RFQ for high-volume resistors', '2025-06-02');
INSERT INTO rfq (id, "supplierId", notes, created_at) VALUES (3, 4, 'RFQ for custom plastic enclosures', '2025-06-03');
INSERT INTO rfq (id, "supplierId", notes, created_at) VALUES (4, 3, 'Urgent RFQ for specialized fasteners', '2025-06-04');
INSERT INTO rfq (id, "supplierId", notes, created_at) VALUES (5, 2, 'RFQ for alternative capacitor supplier', '2025-06-05');

-- ## RFQItem
INSERT INTO rfq_item (id, "rfqId", "componentId", qty) VALUES (1, 1, 5, 500);
INSERT INTO rfq_item (id, "rfqId", "componentId", qty) VALUES (2, 2, 1, 10000);
INSERT INTO rfq_item (id, "rfqId", "componentId", qty) VALUES (3, 3, 4, 1500);
INSERT INTO rfq_item (id, "rfqId", "componentId", qty) VALUES (4, 4, 3, 2000);
INSERT INTO rfq_item (id, "rfqId", "componentId", qty) VALUES (5, 5, 2, 3000);

-- ## SupplierScore
INSERT INTO supplier_score (id, "supplierId", on_time_delivery, quality_rating, cost_competitiveness, responsiveness, overall_score, notes, evaluated_at, "evaluatedById") VALUES (1, 1, 0.95, 4.7, 4.5, 4.8, 4.75, 'Excellent performance', '2025-06-01', 2);
INSERT INTO supplier_score (id, "supplierId", on_time_delivery, quality_rating, cost_competitiveness, responsiveness, overall_score, notes, evaluated_at, "evaluatedById") VALUES (2, 2, 0.98, 4.8, 4.6, 4.9, 4.85, 'Consistently high performer', '2025-06-01', 2);
INSERT INTO supplier_score (id, "supplierId", on_time_delivery, quality_rating, cost_competitiveness, responsiveness, overall_score, notes, evaluated_at, "evaluatedById") VALUES (3, 3, 0.90, 4.2, 4.0, 4.3, 4.13, 'Reliable, but some room for improvement in cost', '2025-06-01', 3);
INSERT INTO supplier_score (id, "supplierId", on_time_delivery, quality_rating, cost_competitiveness, responsiveness, overall_score, notes, evaluated_at, "evaluatedById") VALUES (4, 4, 0.88, 4.0, 4.2, 3.9, 4.05, 'Good on cost, need to improve on-time delivery', '2025-06-01', 3);
INSERT INTO supplier_score (id, "supplierId", on_time_delivery, quality_rating, cost_competitiveness, responsiveness, overall_score, notes, evaluated_at, "evaluatedById") VALUES (5, 1, 0.96, 4.7, 4.5, 4.8, 4.77, 'Updated score after recent POs', '2025-07-01', 2);

-- ## Task
INSERT INTO task (id, title, description, status, due_date, "assignedToId", "createdById", related_entity_type) VALUES (1, 'Follow up on PO #1', 'Check delivery status with DHL', 'open', '2025-06-10', 1, 2, 'PurchaseOrder');
INSERT INTO task (id, title, description, status, due_date, "assignedToId", "createdById", related_entity_type) VALUES (2, 'Review Q3 Component Forecast', 'Analyze demand projections for next quarter', 'open', '2025-06-15', 2, 1, 'ComponentDemand');
INSERT INTO task (id, title, description, status, due_date, "assignedToId", "createdById", related_entity_type) VALUES (3, 'Conduct Warehouse Inventory Audit', 'Perform a full audit of Main Warehouse Toronto', 'in_progress', '2025-06-07', 1, 3, 'WarehouseInventory');
INSERT INTO task (id, title, description, status, due_date, "assignedToId", "createdById", related_entity_type) VALUES (4, 'Evaluate New Supplier for Bolts', 'Research and vet Gamma Mechanical alternatives', 'open', '2025-06-20', 3, 2, 'Supplier');
INSERT INTO task (id, title, description, status, due_date, "assignedToId", "createdById", related_entity_type) VALUES (5, 'Update Product BOM for Smart Thermostat V3', 'Add new CPU to BOM for upcoming version', 'open', '2025-06-25', 4, 1, 'Product');

-- ## risk prediction
INSERT INTO risk_prediction (id, entity_type, entity_id, risk_type, risk_score, rationale, predicted_by, predicted_at) VALUES (1, 'Component', 2, 'supply_delay', 0.87, 'High risk of delay from Beta Electronics', 'AI_model_v2', '2025-06-01');
INSERT INTO risk_prediction (id, entity_type, entity_id, risk_type, risk_score, rationale, predicted_by, predicted_at) VALUES (2, 'PurchaseOrder', 1, 'cost_overrun', 0.75, 'Potential for increased freight costs due to global events', 'AI_model_v1', '2025-06-01');
INSERT INTO risk_prediction (id, entity_type, entity_id, risk_type, risk_score, rationale, predicted_by, predicted_at) VALUES (3, 'Product', 1, 'demand_fluctuation', 0.92, 'Expected sharp increase in demand for Smart Thermostat V2 in Q3', 'AI_model_v2', '2025-06-02');
INSERT INTO risk_prediction (id, entity_type, entity_id, risk_type, risk_score, rationale, predicted_by, predicted_at) VALUES (4, 'Supplier', 4, 'quality_issue', 0.60, 'Minor quality concerns reported by other clients of Delta Materials', 'AI_model_v3', '2025-06-03');
INSERT INTO risk_prediction (id, entity_type, entity_id, risk_type, risk_score, rationale, predicted_by, predicted_at) VALUES (5, 'Warehouse', 1, 'capacity_strain', 0.80, 'Projected stock levels to exceed 90% capacity by August', 'AI_model_v1', '2025-06-04');

-- ## Scenario model
INSERT INTO scenario_model (id, name, description, input_parameters, output_metrics, status, "createdById", created_at) VALUES (1, 'Optimal PO Plan', 'Simulated model for best PO timings', '{"inputs":{}}', '{"output":{}}', 'completed', 1, '2025-06-01');
INSERT INTO scenario_model (id, name, description, input_parameters, output_metrics, status, "createdById", created_at) VALUES (2, 'Demand Spike Response', 'How to handle a sudden 50% increase in product demand', '{"product_id": 1, "demand_increase": 0.5}', '{"recommended_po_qty": 500, "lead_time_impact": "7 days"}', 'completed', 2, '2025-06-02');
INSERT INTO scenario_model (id, name, description, input_parameters, output_metrics, status, "createdById", created_at) VALUES (3, 'Supplier Lead Time Reduction', 'Impact of reducing lead times from key suppliers', '{"supplier_id": 2, "lead_time_reduction_days": 10}', '{"inventory_cost_savings": 15000, "on_time_delivery_increase": 0.03}', 'in_progress', 3, '2025-06-03');
INSERT INTO scenario_model (id, name, description, input_parameters, output_metrics, status, "createdById", created_at) VALUES (4, 'Warehouse Expansion Feasibility', 'Analysis of costs and benefits of expanding Warehouse 1', '{"warehouse_id": 1, "expansion_percent": 0.25}', '{"cost": 500000, "capacity_increase": 0.25}', 'draft', 4, '2025-06-04');
INSERT INTO scenario_model (id, name, description, input_parameters, output_metrics, status, "createdById", created_at) VALUES (5, 'New Product Introduction Simulation', 'Simulating inventory and supply chain needs for a new product launch', '{"new_product_details": {}}', '{"component_requirements": {}, "initial_po_plan": {}}', 'pending', 1, '2025-06-05');


INSERT INTO invoice (invoice_number, customer_name, issue_date, due_date, total_amount, amount_paid, balance_due, status, currency, created_at, updated_at)
VALUES ('INV-2025-001', 'Test Client', '2025-06-01', '2025-06-15', 1000, 500, 500, 'Partially Paid', 'USD', now(), now());

INSERT INTO payment (payment_id, invoice_id, payment_date, amount, type, method, status, description, currency, created_at, updated_at)
VALUES ('PAY-001', 1, now(), 500, 'Incoming', 'Bank Transfer', 'Completed', 'First partial payment', 'USD', now(), now());
