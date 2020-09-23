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
    return `<a title="Add to Calendar" class="btn-cta-secondary addeventatc" data-id="${dscssn.addevent_id}" href="https://www.addevent.com/event/${dscssn.addevent_id}" target="_blank" rel="nofollow">Add to Calendar</a>`;
}