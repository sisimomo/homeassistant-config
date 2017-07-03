#ep_name needs to be available
ep_name = data.get('ep_name')
if ep_name is None:
    logger.error("ep_name missing please add it to the call")
    exit()
current_state = hass.states.get("sensor.recent_episodes")
to_hash = ''
new_attributes = {'entry1': ep_name}
to_hash += ep_name
for x in range(1, 5):
    if current_state is not None:
        new_attributes['entry' + str(x + 1)] = current_state.attributes['entry' + str(x)]
        to_hash += current_state.attributes['entry' + str(x)]
    else:
        new_attributes['entry' + str(x + 1)] = 'NO ENTRY'
h = hashlib.sha224(bytes(to_hash, 'utf-8'))
new_attributes['friendly_name'] = 'Recent entries in Emby'
if current_state is None or current_state.state != h.hexdigest():
    hass.states.set("sensor.recent_episodes", h.hexdigest(), attributes=new_attributes)
exit()
