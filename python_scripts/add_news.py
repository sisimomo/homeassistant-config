#info needs to be available
news = data.get('info')
if news is None:
    logger.error("Parameter: 'info' missing please add it to the call")
else:
    # Switch states around
    for x in range(4, 0, -1):
        switchState = hass.states.get("input_text.news"+str(x)).state
        hass.states.set('input_text.news'+str((x+1)), switchState)
    # Set new state
    hass.states.set('input_text.news1', news)
