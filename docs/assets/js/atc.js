// Inspired by:
// https://github.com/carlsednaoui/add-to-calendar-buttons
// https://github.com/AnandChowdhary/calendar-link/blob/master/index.ts
// https://github.com/AnandChowdhary/add-to-calendar
// https://interactiondesignfoundation.github.io/add-event-to-calendar-docs/
;(function(exports) {

    Object.defineProperty(String.prototype, 'hashCode', {
      value: function() {
        var hash = 0, i, chr;
        for (i = 0; i < this.length; i++) {
          chr   = this.charCodeAt(i);
          hash  = ((hash << 5) - hash) + chr;
          hash |= 0; // Convert to 32bit integer
        }
        return hash;
      }
    });
    
    var MS_IN_MINUTES = 60 * 1000;
  
    var formatTime = function(date, format) {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
  
    var calculateEndTime = function(event) {
      return event.end ?
        event.end :
        new Date(event.start.getTime() + (event.duration * MS_IN_MINUTES));
    };

    var eventUid = function(event) {
      return `${Math.abs(JSON.stringify(event).hashCode())}${event.producer}`;
    }
  
    var calendarGenerators = {

      /* ############### GOOGLE ################## */
      google: function(event) {
        // Example Google-Link with TimeZone
        /*
        https://calendar.google.com/calendar/u/0/r/eventedit?
        text=Welcome+dscssOnline&
        dates=20200929T210000/20200929T213000&
        ctz=Europe/Berlin&
        details=Currently+https://aweisser.github.io/dscss.online+is+only+a+vision+and+we%27re+still+trying+to+figure+out+how+we+can+help+to+improve+the+discussion+culture+on+the+internet.+We+love+to+hear+your+feedback+and+ideas+on+this.+%0A%0AJoin+the+meeting:+%0Ahttps://meet.jit.si/meta.dscss.online%0A%0ATo+join+by+phone+instead+use+one+of+the+following+meeting+dial-in+numbers:+%0Ahttps://meet.jit.si/static/dialInInfo.html?room%3Dmeta.dscss.online%0A%0AIf+also+dialing-in+through+a+room+phone,+join+without+connecting+to+audio:+%0Ahttps://meet.jit.si/meta.dscss.online%23config.startSilent%3Dtrue&
        location=https://aweisser.github.io/dscss.online&
        pli=1&
        uid=1601049895addeventcom&
        sf=true&
        output=xml
        */
        var startTime = formatTime(event.start);
        var endTime = formatTime(calculateEndTime(event));
  
        return encodeURI([
          'https://www.google.com/calendar/render',
          '?action=TEMPLATE',
          '&text=' + (event.title || ''),
          '&dates=' + (startTime || ''),
          '/' + (endTime || ''),
          `&uid=${eventUid(event)}`,
          '&details=' + (event.description || ''),
          '&location=' + (event.location || ''),
          '&sprop=&sprop=name:'
        ].join(''));
      },
  
      /* ############### YAHOO ################## */
      yahoo: function(event) {
        var eventDuration = event.end ?
          ((event.end.getTime() - event.start.getTime())/ MS_IN_MINUTES) :
          event.duration;
  
        // Yahoo dates are crazy, we need to convert the duration from minutes to hh:mm
        var yahooHourDuration = eventDuration < 600 ?
          '0' + Math.floor((eventDuration / 60)) :
          Math.floor((eventDuration / 60)) + '';
  
        var yahooMinuteDuration = eventDuration % 60 < 10 ?
          '0' + eventDuration % 60 :
          eventDuration % 60 + '';
  
        var yahooEventDuration = yahooHourDuration + yahooMinuteDuration;
  
        // Remove timezone from event time
        var st = formatTime(new Date(event.start - (event.start.getTimezoneOffset() *
                                                    MS_IN_MINUTES))) || '';
  
        return encodeURI([
          'http://calendar.yahoo.com/?v=60&view=d&type=20',
          '&title=' + (event.title || ''),
          '&st=' + st,
          '&dur=' + (yahooEventDuration || ''),
          '&desc=' + (event.description || ''),
          '&in_loc=' + (event.location || '')
        ].join(''));
      },
  
      /* ############### ICS ################## */
      ics: function(event) {
        // Example: .ics file
        /*
        BEGIN:VCALENDAR
          PRODID:-//AddEvent Inc//AddEvent.com v1.7//EN
          VERSION:2.0
          BEGIN:VTIMEZONE
            TZID:Europe/Berlin
            BEGIN:STANDARD
              DTSTART:20201025T010000
              TZOFFSETFROM:+0200
              TZOFFSETTO:+0100
              TZNAME:CET
            END:STANDARD
            BEGIN:DAYLIGHT
              DTSTART:20200329T010000
              TZOFFSETFROM:+0100
              TZOFFSETTO:+0200
              TZNAME:CEST
            END:DAYLIGHT
          END:VTIMEZONE
          BEGIN:VEVENT
            DTSTAMP:20200925T154432Z
            STATUS:CONFIRMED
            UID:1601048672addeventcom
            SEQUENCE:0
            DTSTART;TZID=Europe/Berlin:20200929T210000
            DTEND;TZID=Europe/Berlin:20200929T213000
            SUMMARY:Welcome dscssOnline
            DESCRIPTION:Currently https://aweisser.github.io/dscss.online is only a vision and we're still trying to figure out how we can help to improve the discussion culture on the internet. We love to hear your feedback and ideas on this. \n\n\nJoin the meeting: \n\nhttps://meet.jit.si/meta.dscss.online\n\n\nTo join by phone instead use one of the following meeting dial-in numbers: \n\nhttps://meet.jit.si/static/dialInInfo.html?room=meta.dscss.online\n\n\nIf also dialing-in through a room phone\, join without connecting to audio: \n\nhttps://meet.jit.si/meta.dscss.online#config.startSilent=true
            X-ALT-DESC;FMTTYPE=text/html:Currently https://aweisser.github.io/dscss.online is only a vision and we're still trying to figure out how we can help to improve the discussion culture on the internet. We love to hear your feedback and ideas on this. <br /><br />Join the meeting: <br />https://meet.jit.si/meta.dscss.online<br /><br />To join by phone instead use one of the following meeting dial-in numbers: <br />https://meet.jit.si/static/dialInInfo.html?room=meta.dscss.online<br /><br />If also dialing-in through a room phone, join without connecting to audio: <br />https://meet.jit.si/meta.dscss.online#config.startSilent=true
            LOCATION:https://aweisser.github.io/dscss.online
            BEGIN:VALARM
              TRIGGER:-PT30M
              ACTION:DISPLAY
              DESCRIPTION:Reminder
            END:VALARM
            TRANSP:OPAQUE
          END:VEVENT
        END:VCALENDAR
        */
        var startTime = formatTime(event.start);
        var endTime = formatTime(calculateEndTime(event));

        // formating inspired by https://github.com/AnandChowdhary/calendar-link/blob/master/index.ts
        var formattedDescription = (event.description || "")
        .replace(/,/gm, "\,")
        .replace(/;/gm, "\;")
        .replace(/\n/gm, "\\n")
        .replace(/(\\n)[\s\t]+/gm, "\\n");
    
        // formating inspired by https://github.com/AnandChowdhary/calendar-link/blob/master/index.ts
        var formattedLocation = (event.location || "")
        .replace(/,/gm, "\,")
        .replace(/;/gm, "\;")
        .replace(/\n/gm, "\\n")
        .replace(/(\\n)[\s\t]+/gm, "\\n");
  
        // https://www.ionos.de/digitalguide/websites/web-entwicklung/icalendar/
        return encodeURI(
          'data:text/calendar;charset=utf8,' + [
            `PRODID:${event.producer}`,
            'VERSION:2.0',
            'BEGIN:VCALENDAR',
              'VERSION:2.0',
              'BEGIN:VEVENT',
                `UID:${eventUid(event)}`,
                `URL:${document.URL}`, // perhaps append the deep link to the event details page some day e.g. https://dscss.online/dscssn/62. See https://www.kanzaki.com/docs/ical/url.html.
                `DTSTART:${(startTime || '')}`,
                `DTEND:${(endTime || '')}`,
                `SUMMARY:${(event.title || '')}`,
                `DESCRIPTION:${formattedDescription}`,
                `LOCATION:${formattedLocation}`,
              'END:VEVENT',
            'END:VCALENDAR'].join('\n'));
      },
  
      /* ############### ICAL ################## */
      ical: function(event) {
        return this.ics(event);
      },
  
      /* ############### OUTLOOK ################## */
      outlook: function(event) {
        return this.ics(event);
      },

      /* ############### OUTLOOK.com ################## */
      // inspired by https://github.com/AnandChowdhary/calendar-link/blob/master/index.ts
      outlookCom: function(event) {
        var startTime = formatTime(event.start);//, "YYYY-MM-DDTHH:mm:SSZ");
        var endTime = formatTime(calculateEndTime(event));//, "YYYY-MM-DDTHH:mm:SSZ");
        var details = {
          path: "/calendar/action/compose",
          rru: "addevent",
          startdt: startTime,
          enddt: endTime,
          subject: event.title,
          body: event.description,
          location: event.location,
        };
        return `https://outlook.live.com/calendar/0/deeplink/compose?${$.param( // jquery dependency $.param(data);
          details
        )}`.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/g, "$1-$2-$3T$4:$5:$6");
      },
      
      /* ############### Office365 ################## */
      // inspired by https://github.com/AnandChowdhary/calendar-link/blob/master/index.ts
      // https://interactiondesignfoundation.github.io/add-event-to-calendar-docs/services/outlook-web.html
      office365: function(event) {
        var startTime = formatTime(event.start);
        var endTime = formatTime(calculateEndTime(event));
        var details = {
          path: "/calendar/action/compose",
          rru: "addevent",
          startdt: startTime,
          enddt: endTime,
          subject: event.title,
          body: event.description,
          location: event.location,
        };
        return `https://outlook.office.com/calendar/0/deeplink/compose?${$.param( // jquery dependency $.param(data);
          details
        )}`.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/g, "$1-$2-$3T$4:$5:$6");
      },
    };
  
    var generateCalendars = function(event) {
      return {
        google: calendarGenerators.google(event),
        yahoo: calendarGenerators.yahoo(event),
        ical: calendarGenerators.ical(event),
        outlook: calendarGenerators.outlook(event),
        outlookCom: calendarGenerators.outlookCom(event),
        office365: calendarGenerators.office365(event),
      };
    };
  
    // Make sure we have the necessary event data, such as start time and event duration
    var validParams = function(params) {
      return params.data !== undefined && params.data.start !== undefined &&
        (params.data.end !== undefined || params.data.duration !== undefined);
    };
  
    exports.createCalendar = function(params) {
      if (!validParams(params)) {
        console.log('Event details missing.');
        return;
      }
  
      return generateCalendars(params.data);
    };
  })(this);