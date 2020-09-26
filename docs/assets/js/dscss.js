function discussionIsJoinable(dscssn) {
    return discussionEndIsInTheFuture(dscssn);
}

function discussionResultItem(dscssn) {
    return `
    <section class="search-result-item">
        <div class="search-result-item-body">
            <div class="row">
                <div class="col-sm-9">
                    <h3 class="search-result-item-heading">${dscssn.title}</h3>
                    <p class="info">${dayjs.unix(dscssn.start_time.seconds).format('MMMM D, YYYY h:mm A')}, Duration: ${dscssn.duration_min} min</p>
                    <p class="description">${dscssn.description}</p>
                </div>
                <div class="col-sm-3">
                    <p>Language: ${dscssn.language}</p>
                    <p class="text-muted">Host: ${dscssn.host}</p>
                    ${discussionLink(dscssn)}
                </div>
            </div>
        </div>
    </section>`;
}

function discussionLink(dscssn) {
    if (discussionStartsSoonOrIsStillRunning(dscssn))
        return joinDiscussionLink(dscssn);
    return saveDiscussionDateLink(dscssn);
}

function discussionStartsSoonOrIsStillRunning(dscssn) {
    var startTimeMillis = dscssn.start_time.seconds * 1000;
    var tenMinutesMillis = 10 * 60 * 1000;
    var aboutToStartMillis = startTimeMillis - tenMinutesMillis;
    var nowMillis = Date.now();
    return discussionEndIsInTheFuture(dscssn) && nowMillis >= aboutToStartMillis ;
}

function discussionEndIsInTheFuture(dscssn) {
    var startTimeMillis = dscssn.start_time.seconds * 1000;
    var endTimeMillis = startTimeMillis + dscssn.duration_min * 60 * 1000;
    var nowMillis = Date.now();
    return nowMillis < endTimeMillis;
}

function joinDiscussionLink(dscssn) {
    return `<a class="btn btn-cta-secondary btn-info btn-sm" href="${dscssn.meeting_url}" target="_blank">Join</a>`;
}

function saveDiscussionDateLink(dscssn) {

    var cal = createCalendar({
        data: {
            producer: 'dscss.online',
            title: dscssn.title,
            start: new Date(dscssn.start_time.seconds * 1000),
            duration: dscssn.duration_min,
            location: dscssn.meeting_url,
            description: dscssn.description 
            + "\n\n\n"
            + "Click here to join the meeting:"
            + "\n"
            + dscssn.meeting_url
        }
    });
    
    return `
    <div class="dropdown">
        <a class="btn btn-cta-secondary btn-sm btn-dropdown" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="far fa-calendar"/> Add to Calendar
        </a>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <a class="atc-link atc-apple dropdown-item" href="${cal.ical}">Apple</a>
            <a class="atc-link atc-google dropdown-item" href="${cal.google}" target="_blank">Google <em>(online)</em></a>
            <a class="atc-link atc-office365 dropdown-item" href="${cal.office365}" target="_blank">Office 365 <em>(online)</em></a>
            <a class="atc-link atc-outlook dropdown-item" href="${cal.outlook}">Outlook</a>
            <a class="atc-link atc-outlookCom dropdown-item" href="${cal.outlookCom}" target="_blank">Outlook.com <em>(online)</em></a>
            <a class="atc-link atc-yahoo dropdown-item" href="${cal.yahoo}" target="_blank">Yahoo <em>(online)</em></a>
        </div>
    </div>`;
}

function nextContribMeetingHtml(dscssn) {
    var cal = createCalendar({
        data: {
            producer: 'dscss.online',
            title: dscssn.title,
            start: new Date(dscssn.start_time.seconds * 1000),
            duration: dscssn.duration_min,
            location: dscssn.meeting_url,
            description: dscssn.description 
            + "\n\n\n"
            + "Click here to join the meeting:"
            + "\n"
            + dscssn.meeting_url
        }
    });
    
    return `
        <p class="text-center">
            Next meetup: ${dayjs.unix(dscssn.start_time.seconds).format('MMMM D, YYYY h:mm A')}
        </p>
        <p class="text-center">
            <a href="${cal.ical}" title="Apple"><img src="assets/images/apple.svg" alt="Apple" style="width:23px;;margin-left:11px;margin-right:11px;padding-bottom:5px;"/></a>
            <a href="${cal.google}" title="Google" target="_blank"><img src="assets/images/google.svg" alt="Google" style="width:25px;margin-left:10px;margin-right:10px;" /></a>
            <a href="${cal.office365}" title="Office 365" target="_blank"><img src="assets/images/office-365.svg" alt="Office 365" style="width:19px;;margin-left:13px;margin-right:13px;" /></a>
            <a href="${cal.outlook}" title="Outlook"><img src="assets/images/outlook.svg" alt="Outlook" style="width:31px;;margin-left:6px;margin-right:6px;" /></a>
            <a href="${cal.outlookCom}" title="Outlook.com" target="_blank"><img src="assets/images/outlookCom.svg" alt="Outlook.com" style="width:31px;;margin-left:6px;margin-right:6px;" /></a>
            <a href="${cal.yahoo}" title="Yahoo" target="_blank"><img src="assets/images/yahoo.svg" alt="Yahoo" style="width:25px;;margin-left:10px;margin-right:10px;" /></a>
        </p>`;
}

