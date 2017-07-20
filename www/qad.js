	var homeassistant;
	var mounted = false;
	var timeOnce = true;
	var watched_entities = [
		"group.light_livingroom",
		"device_tracker.janis_handy",
		"device_tracker.lena_handy",
		"proximity.home_janis",
		"proximity.home_lena",
		"sensor.dark_sky_temperature",
		"input_boolean.dinner_mode",
		"input_boolean.party_mode",
		"input_boolean.shelf_light",
		"input_boolean.blue_light",
		"input_boolean.led_strip",
		"alarm_control_panel.alarm",
		"automation.motion_light",
		"input_boolean.tv",
		"sensor.news"
	];
	var alarmCode = "";
	var alarmAction = "";

	function addNumber(key) {
		if(alarmCode.length < 4){
			alarmCode = alarmCode + key;
		}
		if(alarmCode.length == 4){
			homeassistant.callService('alarm_control_panel', alarmAction, { entity_id: 'alarm_control_panel.alarm', code: alarmCode })
			$('body /deep/ #qad-numpad').css('display', 'none');
			alarmCode = "";
		}
	}

	function switchDIVs(page1, page2) {
		var group1 = $('body /deep/ #'+page1).css('display');
		var group2 = $('body /deep/ #'+page2).css('display');

		$('body /deep/ #'+page2).css('display', group1);
		$('body /deep/ #'+page1).css('display', group2);
	}

	function startTime() {
		$('body /deep/ #qad-datetime').html(new Date().toLocaleString('de-DE', { hour: "numeric", minute: "numeric", day: "2-digit", month: "2-digit", year: "2-digit"}));
		var t = setTimeout(startTime, 30000);
	}

	function updateView(ent){
		if (mounted) {
			var output = $("body /deep/ #qad-"+(ent.entity_id).replace(".","-"));
			var new_html;
			var icon ='';
			var text = '';
			var alarm = false;

			switch(ent.entity_id) {
				case 'group.light_livingroom':
					icon = 'fa fa-lightbulb-o';
					text = 'Ceiling';
					break;

				case 'input_boolean.shelf_light':
					icon = 'fa fa-lightbulb-o';
					text = 'Shelf';
					break;

				case 'input_boolean.dinner_mode':
					icon = 'fa fa-cutlery';
					text = 'Dinner';
					break;

				case 'automation.motion_light':
					icon = 'fa fa-podcast';
					text = 'Motion';
					break;

				case 'input_boolean.party_mode':
					icon = 'fa fa-glass';
					text = 'Party';
					break;

				case 'input_boolean.tv':
					icon = 'fa fa-television';
					text = 'TV';
					break;

                case 'input_boolean.blue_light':
					icon = 'fa fa-lightbulb-o';
					text = 'Blue light';
					break;

                case 'input_boolean.led_strip':
					icon = 'fa fa-lightbulb-o';
					text = 'LED Strip';
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
				    if (ent.state > 1000) {
				        new_html = (Math.round((ent.state / 1000) * 100) / 100) + 'k' + ent.attributes.unit_of_measurement;
				    }
				    else {
				        new_html = ent.state + ent.attributes.unit_of_measurement;
				    }
					var janis = homeassistant.states["device_tracker.janis_handy"];
					var lena = homeassistant.states["device_tracker.lena_handy"];
					if (ent.entity_id === "proximity.home_janis" && (janis.state.toLowerCase() === "home" || janis.state.toLowerCase() === "work")) {
						new_html = janis.state;
					} else if (ent.entity_id === "proximity.home_lena" && (lena.state.toLowerCase() === "home" || lena.state.toLowerCase() === "work")) {
						new_html = lena.state;
					}
					break;

				case 'sensor.news':
					new_html = ''
					for (x = 1; x <= 5; x++) {
						new_html += '<div class="scrollContent">'+ent.attributes['entry'+x]+'</div>';
					}
					break;

				case 'sensor.dark_sky_temperature':
					new_html = ent.state + ent.attributes.unit_of_measurement;
					break;
			}
			if (icon != '') {
				if (alarm) {
					new_html = "<button class=\"qad-button-"+ent.state+"\" onclick=\"$('body /deep/ #qad-numpad').css('display', 'block');\"><i class=\""+icon+"\" aria-hidden=\"true\"></i><p style=\"font-size:10px\">"+text+"</p></button>";
				}
				else {
					var action = "turn_off";
					if(ent.state === "off") {
						action = "turn_on";
					}
					new_html = "<button class=\"qad-button-"+ent.state+"\" onclick=\"homeassistant.callService('"+ent.entity_id.substr(0, ent.entity_id.indexOf('.')).replace("group","light")+"', '"+action+"', { entity_id: '"+ent.entity_id+"' });\"><i class=\""+icon+"\" aria-hidden=\"true\"></i><p style=\"font-size:10px\">"+text+"</p></button>";
				}
			}
			var outputState = $("body /deep/ #qad-"+(ent.entity_id).replace(".","-")+"_state");
			if(outputState.length != 0 && outputState.text() != ent.state){
				outputState.text(ent.state)
				output.html(new_html);
 				if (ent.entity_id === 'sensor.recent_episodes') {
					var x = 0;
					output.children().each(function(){
						x++;
						if($(this)[0].scrollWidth > $(this)[0].clientWidth) {
							$(this).html('<div class="scrollable">'+$(this).text()+'</div>');
							$(this).children().css('animation-duration', $(this)[0].scrollWidth * 12 +'ms');
							$(this).children().css('animation-name', 'marquee'+x);
							var thisStyle = '<style scoped>.scrollable {animation-duration: '+ $(this)[0].scrollWidth * 12 +'ms; animation-iteration-count: infinite; animation-timing-function: linear; animation-name: marquee'+x+'; }</style>'
							$(this).children().text($(this).children().text()+' | '+$(this).children().text());
							$(this).html(thisStyle+$(this).html());
							var style = $("body /deep/ style[scope='ha-panel-qad']");
							var oldCSS = style.text();
							var re = new RegExp("marquee"+x+" \\{\\s*0% \\{\\s*transform: translateX\\(0px\\)\\;\\s*\}\\s*100% \\{\\s*transform: translateX\\(0px\\);","g");
							style.text(oldCSS.replace(re, 'marquee'+x+' { 0% { transform: translateX(0px); } 100% { transform: translateX(-'+$(this)[0].scrollWidth / 2+'px);'));
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