	var homeassistant;
	var mounted = false;
	var timeOnce = true;
	var watched_entities = [
		"group.light_livingroom",
		"device_tracker.janis_handy",
		"device_tracker.lena_handy",
		"proximity.home_janis",
		"proximity.home_lena",
		"sensor.owm_temperature",
		"input_boolean.dinner_mode",
		"input_boolean.party_mode",
		"switch.edimax1",
		"alarm_control_panel.alarm",
		"input_boolean.disable_motion_light_livingroom",
		"input_boolean.media_devices",
		"sensor.recent_episodes"
	];
	var alarmCode = "";
	var alarmAction = "";

	function addNumber(key) {
		if(alarmCode.length < 4){
			alarmCode = alarmCode + key;
		}
		if(alarmCode.length == 4){
			homeassistant.callService('alarm_control_panel', alarmAction, { entity_id: 'alarm_control_panel.alarm', code: alarmCode })
			document.getElementById('qad-numpad').style.display = 'none';
			alarmCode = "";
		}
	}

	function switchDIVs(page1, page2) {
		var group1 = document.getElementById(page1).currentStyle ? document.getElementById(page1).currentStyle.display : getComputedStyle(document.getElementById(page1), null).display;
		var group2 = document.getElementById(page2).currentStyle ? document.getElementById(page2).currentStyle.display : getComputedStyle(document.getElementById(page2), null).display;

		document.getElementById(page2).style.display = group1
		document.getElementById(page1).style.display = group2
	}

	function startTime() {
		var today = new Date();
		var h = today.getHours();
		var m = today.getMinutes();
		var s = today.getSeconds();
		m = checkTime(m);
		s = checkTime(s);
		document.getElementById('qad-datetime').innerHTML =
		h + ":" + m + ":" + s;
		var t = setTimeout(startTime, 500);
	}
	function checkTime(i) {
		if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
		return i;
	}

	function updateView(ent){
		if (mounted) {
			var output = $("#qad-"+(ent.entity_id).replace(".","-"));
			var new_html;
			var icon ='';
			var text = '';
			var alarm = false;

			switch(ent.entity_id) {
				case 'group.light_livingroom':
					icon = 'fa fa-lightbulb-o';
					text = 'Ceiling';
					break;

				case 'switch.edimax1':
					icon = 'fa fa-lightbulb-o';
					text = 'Shelf';
					break;

				case 'input_boolean.dinner_mode':
					icon = 'fa fa-cutlery';
					text = 'Dinner';
					break;

				case 'input_boolean.disable_motion_light_livingroom':
					icon = 'fa fa-podcast';
					text = 'Motion';
					break;

				case 'input_boolean.party_mode':
					icon = 'fa fa-glass';
					text = 'Party';
					break;

				case 'input_boolean.media_devices':
					icon = 'fa fa-television';
					text = 'AV / TV';
					break;

				case 'alarm_control_panel.alarm':
				case 'alarm_control_panel.alarm2':
					if (ent.entity_id === "alarm_control_panel.alarm") {
						var ent2 = ent;
						ent2.entity_id = ent.entity_id+"2"
						updateView(ent2)
					}
					new_html = "<button class=\"qad-button-on\">?</button>";
					switch (ent.state) {
						case 'disarmed':
							alarmAction = "alarm_arm_home"
							alarm = true;
							icon = 'fa fa-bell-slash';
							text = 'Disarmed';
							break;

						case 'armed_home':
						case 'armed_away':
							alarmAction = "alarm_disarm"
							alarm = true;
							icon = 'fa fa-bell';
							text = 'Armed';
							break;

						case 'pending':
							alarmAction = "alarm_disarm"
							alarm = true;
							icon = 'fa fa-ellipsis-h';
							text = 'Pending';
							break;

						case 'triggered':
							alarmAction = "alarm_disarm"
							icon = 'fa fa-bullhorn';
							text = 'Triggered';
							break;
					}
					break;

				case 'device_tracker.janis_handy':
				case 'device_tracker.lena_handy':
					new_html = "<img src=\""+ent.attributes.entity_picture.replace("/local", "../local")+"\" width=\"65\" height=\"65\" />";
					break;

				case 'proximity.home_janis':
				case 'proximity.home_lena':
					new_html = ent.state + ent.attributes.unit_of_measurement;
					var janis = homeassistant.states["device_tracker.janis_handy"];
					var lena = homeassistant.states["device_tracker.lena_handy"];
					if (ent.entity_id === "proximity.home_janis" && (janis.state.toLowerCase() === "home" || janis.state.toLowerCase() === "work")) {
						new_html = janis.state;
					} else if (ent.entity_id === "proximity.home_lena" && (lena.state.toLowerCase() === "home" || lena.state.toLowerCase() === "work")) {
						new_html = lena.state;
					}
					break;

				case 'sensor.recent_episodes':
					new_html = ''
					for (x = 1; x <= 5; x++) {
						if(ent.attributes['entry'+x].length > 50) {
							new_html += '<div class="scrollContent"><div class="scrollable">'+ent.attributes['entry'+x]+' | '+ent.attributes['entry'+x]+'</div></div>';
						} else {
							new_html += '<div class="scrollContent">'+ent.attributes['entry'+x]+'</div>';
						}
					}
					break;

				case 'sensor.owm_temperature':
					new_html = ent.state + ent.attributes.unit_of_measurement;
					if (homeassistant.states["sensor.owm_cloud_coverage"].state >= 60) {
						new_html += "<span class=\"fa-stack\"><i class=\"fa fa-cloud fa-stack-1x\"></i><i class=\"fa fa-circle-thin fa-stack-2x text-danger\"></i></span>"
					}
					else {
						new_html += "<span class=\"fa-stack\"><i class=\"fa fa-cloud fa-stack-1x\"></i><i class=\"fa fa-ban fa-stack-2x text-danger\"></i></span>"
					}
					if (homeassistant.states["sensor.owm_rain"].state == "not raining") {
						new_html += "<span class=\"fa-stack\"><i class=\"fa fa-umbrella fa-stack-1x\"></i><i class=\"fa fa-ban fa-stack-2x text-danger\"></i></span>"
					}
					else {
						new_html += "<span class=\"fa-stack\"><i class=\"fa fa-umbrella fa-stack-1x\"></i><i class=\"fa fa-circle-thin fa-stack-2x text-danger\"></i></span>"
					}
					if (homeassistant.states["sensor.owm_snow"].state == "not snowing") {
						new_html += "<span class=\"fa-stack\"><i class=\"fa fa-snowflake-o fa-stack-1x\"></i><i class=\"fa fa-ban fa-stack-2x text-danger\"></i></span>"
					}
					else {
						new_html += "<span class=\"fa-stack\"><i class=\"fa fa-snowflake-o fa-stack-1x\"></i><i class=\"fa fa-circle-thin fa-stack-2x text-danger\"></i></span>"
					}
					break;
			}
			if (icon != '') {
				if (alarm) {
					new_html = "<button class=\"qad-button-"+ent.state+"\" onclick=\"document.getElementById('qad-numpad').style.display = 'block';\"><i class=\""+icon+"\" aria-hidden=\"true\"></i><p style=\"font-size:10px\">"+text+"</p></button>";
				}
				else {
					var action = "turn_off";
					if(ent.state === "off") {
						action = "turn_on";
					}
					new_html = "<button class=\"qad-button-"+ent.state+"\" onclick=\"homeassistant.callService('"+ent._domain.replace("group","light")+"', '"+action+"', { entity_id: '"+ent.entity_id+"' });\"><i class=\""+icon+"\" aria-hidden=\"true\"></i><p style=\"font-size:10px\">"+text+"</p></button>";
				}
			}
			var outputState = $("#qad-"+(ent.entity_id).replace(".","-")+"_state");
			if(outputState.length != 0 && outputState.text() != ent.state){
				outputState.text(ent.state)
				output.html(new_html);
				if (ent.entity_id === 'sensor.recent_episodes') {
					var x = 0;
					output.children().each(function(){
						x++;
						$(this).children().css('animation-duration', $(this)[0].scrollWidth / 100+'s');
						$(this).children().css('animation-name', 'marquee'+x);
						var thisStyle = '<style scoped>.scrollable {animation-duration: '+ $(this)[0].scrollWidth / 100 +'s; animation-iteration-count: infinite; animation-timing-function: linear; animation-name: marquee'+x+'; }</style>'
						$(this).html(thisStyle+$(this).html());
						var
						  stylesheet = document.querySelector("link[href='../local/qad.css']").sheet
						, rules = stylesheet.rules
						, i = rules.length
						, keyframes
						, keyframe
					;
					while (i--) {
						keyframes = rules.item(i);
						if ( keyframes.type === keyframes.KEYFRAMES_RULE && keyframes.name === "marquee"+x ) {
							rules = keyframes.cssRules;
							i = rules.length;
							while (i--) {
								keyframe = rules.item(i);
								if ( keyframe.type === keyframe.KEYFRAME_RULE && keyframe.keyText === "100%") {
									keyframe.style.transform = "translateX(-" + $(this)[0].scrollWidth / 2 + "px)";
									break;
								}
							}
							break;
						}
					}
					});
				}
			} else if (outputState.length == 0){
				output.html(new_html);
			}
		}
	}

	function qadObserve(id){
		updateView(homeassistant.states[id]);
	}

	function render(hass) {
		mounted = true;
		// Register for updates
		homeassistant = hass;
		watched_entities.forEach(qadObserve);
		if(timeOnce) {
			timeOnce = false;
			startTime();
		}
	}
	// Polymer stuff
	Polymer({
		is: 'ha-panel-qad',
		properties: {
			// Home Assistant object
			hass: {
				type: Object,
			},
			// If should render in narrow mode
			narrow: {
				type: Boolean,
				value: false,
			},
			// If sidebar is currently shown
			showMenu: {
				type: Boolean,
				value: false,
			},
			// Home Assistant panel info
			// panel.config contains config passed to panel_custom serverside
			panel: {
				type: Object,
			}
		},
		// This will make sure we forward changed properties
		observers: [
			'propsChanged(hass, narrow, showMenu, panel)',
		],
		// Called when properties change
		propsChanged: function (hass, narrow, showMenu, panel) {
			this.mount(hass, narrow, showMenu, panel);
		},
		// Render. Debounce in case multiple properties change.
		mount: function (hass, narrow, showMenu, panel) {
			this.debounce('mount', function () {
				render(hass);
			}.bind(this));
		},
		detached: function () {
			mounted = false;
		}
	});