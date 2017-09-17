#info needs to be available
news = data.get('info')
if news is None:
    logger.error("Parameter: 'info' missing please add it to the call")
else:
    # Switch states around
    for x in range(1, 5):
        state = hass.states.get('input_text.news'+x).state
        hass.states.set('input_text.news'+(x+1), old_state)
    # Set new state
    hass.states.set('input_text.news1', news)
