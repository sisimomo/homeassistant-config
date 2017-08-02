#info needs to be available
number = data.get('number')
action = data.get('action')
if action is None:
    pin = hass.states.get("sensor.floorplan_alarm_pin")
    new_pin = pin + "" + number
    hass.states.set(hass.states.set("sensor.floorplan_alarm_pin", new_pin))
else:
    pin = hass.states.get("sensor.floorplan_alarm_pin")
    hass.services.call(alarm_control_panel, action, service_data={ 'entity_id': 'alarm_control_panel.alarm', 'code': pin })