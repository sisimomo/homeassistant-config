#info needs to be available
ep_name = data.get('info')
if ep_name is None:
    logger.error("Parameter: 'info' missing please add it to the call")
else:
    current_state = hass.states.get("sensor.recent_episodes")
    if current_state is None:
      hass.states.set(hass.states.set("sensor.recent_episodes", "INIT"))
    new_attributes = {'friendly_name': 'Recent entries in Emby', 'entry1': ep_name, 'entry2':current_state.attributes.get('entry1') or 'NO ENTRY', 'entry3':current_state.attributes.get('entry2') or 'NO ENTRY', 'entry4':current_state.attributes.get('entry3') or 'NO ENTRY', 'entry5':current_state.attributes.get('entry4')}
    hass.states.set("sensor.recent_episodes", ep_name, attributes=new_attributes)
