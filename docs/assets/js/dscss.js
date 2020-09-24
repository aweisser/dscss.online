function addToDiscussions(dscssn) {
    if(discussionIsJoinable(dscssn)) {
        $('.search-results').append(discussionResultItem(dscssn));
    }
}

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
