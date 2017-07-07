#info needs to be available
ep_name = data.get('info')
if ep_name is None:
    logger.error("Parameter: 'info' missing please add it to the call")
else:
    current_state = hass.states.get("sensor.recent_episodes")
    if ep_name == 'INIT':
      new_attributes = {'friendly_name': 'Recent entries in Emby', 'entry1': 'NO ENTRY', 'entry2': 'NO ENTRY', 'entry3': 'NO ENTRY', 'entry4': 'NO ENTRY', 'entry5': 'NO ENTRY'}
      hass.states.set(hass.states.set("sensor.recent_episodes", 'NO ENTRY', new_attributes))
    else:
      new_attributes = {'friendly_name': 'Recent entries in Emby', 'entry1': ep_name, 'entry2':current_state.attributes.get('entry1'), 'entry3':current_state.attributes.get('entry2'), 'entry4':current_state.attributes.get('entry3'), 'entry5':current_state.attributes.get('entry4')}
      hass.states.set("sensor.recent_episodes", ep_name, attributes=new_attributes)